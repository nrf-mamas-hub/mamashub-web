import fetch from "cross-fetch";
import { v4 as uuidv4 } from "uuid";
import { reports } from "./allReports.json";
import { getPatients } from "./reports";
import * as observationCodes from "./observationCodes.json";

import db from "./prisma";

export let codes: any = observationCodes.codes;

let codesIndex: any = {};
Object.keys(codes).map((code: string) => {
  codesIndex[codes[code].split(":")[1]] = code;
});

export let indexedCodes = codesIndex;

export const parseIdentifiers = async (
  patientId: string | null = null,
  patientResource: any | null = null
) => {
  try {
    if (patientId) {
      let patient = (await FhirApi({ url: `/Patient/${patientId}` })).data;
      if (!(patient?.total > 0 || patient?.entry.length > 0)) {
        return null;
      }
      let identifiers = patient.entry[0].resource.identifier;
      return identifiers.map((id: any) => {
        return {
          [id.id]: id,
        };
      });
    } else if (patientResource) {
      let identifiers = patientResource.identifier;
      return identifiers.map((id: any) => {
        return {
          [id.id]: id,
        };
      });
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getRegistrationDate = async (
  patientId: string | null = null,
  patientResource: any | null = null
) => {
  try {
    if (patientId) {
      let patient = await (
        await FhirApi({ url: `/Patient/${patientId}/_history/1` })
      ).data;
      return patient.meta.lastUpdated;
    } else if (patientResource) {
      return patientResource.meta.lastUpdated;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const filterPatientsByRegistrationDate = async (
  kmhflCode: string,
  from: Date,
  to: Date
) => {
  try {
    let _patients = await (await FhirApi({ url: `/Patient/_history/1` })).data;
    let patients = [];
    for (let patient of _patients) {
      let registrationDate = await getRegistrationDate(null, patient.resource);
      let identifiers = await parseIdentifiers(null, patient);
      if (
        registrationDate >= from &&
        registrationDate <= to &&
        identifiers.KMHFL_CODE.value === kmhflCode
      ) {
        patients.push(patient.resource);
      }
    }
    return patients;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// parseIdentifiers("KE-2023-01-FBE66").then((res)=> {
//     console.log(res)
// })
export const parseFhirPatient = (patient: any) => {
  let identifiers = patient.identifier || [];
  let _ids: any = {};

  if (Array.isArray(identifiers)) {
    for (let id of identifiers) {
      _ids[id.id] = id;
    }
  }

  const standardPatientInfo = {
    id: patient.id,
    fullNames: patient.name[0].family,
    ancNumber: _ids.ANC_NUMBER?.value || "",
    otherNames: patient.name[0].given[0],
    sex: patient.gender,
    dob: new Date(patient.birthDate).toDateString(),
    // maritalStatus: patient.maritalStatus.coding[0].display,
    deceased: patient.deceasedBoolean,
    country: patient.address[0].country,
    ward: patient.address[0].city,
    county: patient.address[0].state,
    subCounty: patient.address[0].district,
  };

  // check whether client is a mother or child using the next of kin property
  // this property is required for mothers during ANC registration, unlike for new borns
  const nextOfKinRelationship = patient.contact[0]?.relationship[0]?.text || "";

  if (nextOfKinRelationship) {
    return {
      ...standardPatientInfo,
      idNumber: _ids.NATIONAL_ID?.value || "",
      pncNumber: _ids.PNC_NUMBER?.value || "",
      phone: patient.telecom[0].value,
      nextOfKinRelationship: nextOfKinRelationship,
      nextOfKinName: patient.contact[0].name.family,
      nextOfKinPhone: patient.contact[0].telecom[0].value,
    };
  } else {
    return {
      ...standardPatientInfo, //more properties to be added based on the primary unique identifier for children, same as ANC/PNC number for mothers
      motherName: patient.contact[0].name.family,
      motherPhone: patient.contact[0].telecom[0].value,
    };
  }
};

export const createObservationValue = (value: number, unit: any) => {
  return { value, unit, system: "http://unitsofmeasure.org" };
};

export const createObservation = (
  patientId: string,
  observationValue: any,
  coding: any,
  id: string,
  encounterId: string
) => {
  return {
    resourceType: "Observation",
    ...(id && { id: id }),
    ...(!id && { id: uuidv4() }),
    status: "final",
    code: {
      coding: [
        {
          system:
            coding.system === "snomed"
              ? "http://snomed.info/sct"
              : coding.system === "loinc"
              ? "http://loinc.org"
              : "http://intellisoftkenya.com",
          code: coding.code,
          display: coding.display,
        },
      ],
    },
    subject: { reference: `Patient/${patientId}` },
    encounter: { reference: `Encounter/${encounterId}` },
    ...observationValue,
    effectiveDateTime: new Date().toISOString(),
    issued: new Date().toISOString(),
    meta: {
      profile: [
        "http://fhir.org/guides/who/core/StructureDefinition/who-observation",
        "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-observation",
        "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-b4-de1",
      ],
    },
  };
};

export const createEncounter = (
  patientId: string,
  encounterId: string,
  encounterType: number = 2,
  encounterCode: string | null = null,
  locationId?: string
) => {
  if (encounterType > 3 || encounterType < 1) {
    console.error("Encounter type is either 1, 2 or 3");
    return;
  }
  return {
    resourceType: "Encounter",
    id: encounterId,
    reference: {
      patient: `Patient/${patientId}`,
    },
    meta: {
      profile: [
        "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-encounter",
        "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-base-encounter",
        "http://fhir.org/guides/who/core/StructureDefinition/who-encounter",
      ],
    },
    identifier: [
      {
        use: "official",
        system: "http://example.org/fhir/NamingSystem/identifiers",
        value: encounterId,
      },
    ],
    subject: {
      reference: `Patient/${patientId}`,
    },
    period: {
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    },
    reasonCode: [
      {
        coding: [
          encounterType === 1
            ? {
                system:
                  "http://fhir.org/guides/who/anc-cds/CodeSystem/anc-custom-codes",
                code: encounterCode,
                display: "First antenatal care contact",
              }
            : encounterType === 2
            ? {
                system:
                  "http://fhir.org/guides/who/anc-cds/CodeSystem/anc-custom-codes",
                code: encounterCode,
                display: "Scheduled antenatal care contact",
              }
            : {
                system:
                  "http://fhir.org/guides/who/anc-cds/CodeSystem/anc-custom-codes",
                code: encounterCode,
                display: "Specific complaint related to antenatal care",
              },
        ],
      },
    ],
    ...(locationId && {
      location: [
        {
          location: {
            reference: `Location/${locationId}`,
          },
        },
      ],
    }),
  };
};

// create location resources
export let registerFacility = async () => {
  return 8;
};

export let apiHost = process.env.FHIR_BASE_URL;

export const FhirApi = async (params: any) => {
  let _defaultHeaders = { "Content-Type": "application/json" };
  if (!params.method) {
    params.method = "GET";
  }
  try {
    let response = await fetch(String(`${apiHost}${params.url}`), {
      headers: params.headers ? params.headers : _defaultHeaders,
      method: params.method ? String(params.method) : "GET",
      ...(params.method !== "GET" &&
        params.method !== "DELETE" && { body: String(params.data) }),
    });
    let responseJSON = await response.json();
    let res = {
      status: "success",
      statusText: response.statusText,
      data: responseJSON,
    };
    return res;
  } catch (error) {
    console.error(error);
    let res = {
      statusText: "FHIRFetch: server error",
      status: "error",
      data: error,
    };
    console.error(error);
    return res;
  }
};

export const generateReport = async (name: any) => {
  const reportName = name as keyof typeof reports;
  let report = reports[reportName];
  // console.log(report)
  let data = await FhirApi({ url: report.q });
  if (data.status === "success") {
    // console.log(data.data[report.query])
    if (report.query !== "entry") {
      return parseFloat((data.data[report.query] || 0).toString());
    } else {
      return data.data[report.query] || [];
    }
  }
  return parseFloat("0.0");
};

export let clearEncounters = async (
  patient: string | null,
  code: string | null = null
) => {
  let _encounters = (
    await FhirApi({
      url: `/Encounter?${
        patient && code
          ? `patient=${patient}&reason-code=${code}`
          : code
          ? `reason-code=${code}`
          : patient
          ? `patient=${patient}`
          : ""
      }`,
    })
  ).data;
  let encounters: any = _encounters.entry ?? [];
  console.log(_encounters);
  for (let encounter of encounters) {
    console.log(encounter.resource.id);
    let res = await (
      await FhirApi({
        url: `/Encounter/${encounter.resource.id} `,
        method: "DELETE",
      })
    ).data;
    console.log(res);
  }
};

export let clearObservations = async (
  patient: string | null,
  code: string | null = null
) => {
  let _observations = (
    await FhirApi({
      url: `/Observation?${
        patient && code
          ? `patient=${patient}&code=${code}`
          : code
          ? `code=${code}`
          : patient
          ? `patient=${patient}`
          : ""
      } `,
    })
  ).data;
  let observations: any = _observations.entry ?? [];
  // console.log(_observations);
  for (let observation of observations) {
    // console.log(observation)
    let res = await FhirApi({
      url: `/Observation/${observation.resource.id}`,
      method: "DELETE",
    });
  }
};

//PATIENT UTILS
export const getPatientByIdentifier = async (
  ancNumber: string | null = null,
  idNumber: string | null = null
) => {
  try {
    let res = await (
      await FhirApi({ url: `/Patient?identifier=${idNumber ?? ancNumber}` })
    ).data;
    // console.log(res)
    return res.entry[0].resource || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllPatientsObservations = async (
  patientId: string,
  from: Date | null = null,
  to: Date | null = null
) => {
  try {
    let observations = await (
      await FhirApi({ url: `/Observation?patient=${patientId}&_count=100000&` })
    ).data;
    // console.log(observations)
    if (observations.total > 0) {
      let _observations: any = {};
      observations = observations.entry;
      for (let observation of observations) {
        let value = observation.resource.valueQuantity
          ? observation.resource.valueQuantity.value
          : observation.resource.valueString ||
            observation.resource.valueDateTime ||
            "-";
        _observations[getObservationCode(observation.resource)] = value;
      }
      // console.log(_observations);
      return _observations;
    }
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getAllPatientsObservationsMapped = async (
  patientId: string,
  from: Date | null = null,
  to: Date | null = null
) => {
  try {
    let observations = await getAllPatientsObservations(patientId, from, to);
    let _map: any = {};
    Object.keys(observations).map((observation: string) => {
      _map[codesIndex[observation]] = observations[observation];
    });
    // console.log(_map)
    return _map;
  } catch (error) {
    console.log(error);
    return {};
  }
};

// getAllPatientsObservationsMapped("059dc9eb-790c-48d4-85ea-9c83fa7498f1")

//OBSERVATION UTILS
export const getObservationCode = (observation: any) => {
  try {
    let code = observation.code.coding[0].code;
    return code;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getObservationsWhere = async (
  observationCode: string,
  value: any | null,
  facility: string | null = null
) => {
  try {
    let observations = [];
    let patients = await getPatients(undefined, undefined, facility);
    for (let patient of patients) {
      // console.log(patient);
      let res = await (
        await FhirApi({
          url: `/Observation?patient=${
            patient.resource.id
          }&code=${observationCode}${value && `&value-string=${value}`}`,
        })
      ).data;
      if (res.entry) {
        observations.push(res);
      }
    }
    return observations;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const countObservationsWhere = async (
  observationCode: string,
  value: any | null = null,
  facility: string | null = null
) => {
  try {
    let res = await getObservationsWhere(observationCode, value, facility);
    if (res) {
      return res.length;
    }
    return 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

// ENCOUNTER UTILS
export const getEncountersWhere = async (
  encounterCode: string,
  value: any,
  patient: string | null,
  facility: string | null = null
) => {
  try {
    let encounters = [];
    let res = await (
      await FhirApi({ url: `/Encounter?reason-code=${encounterCode}` })
    ).data;
    return res.entry ? res.entry : [];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const countEncountersWhere = async (
  observationCode: string,
  value: any,
  patient: string | null,
  facility: string | null = null
) => {
  try {
    let res = await getEncountersWhere(
      observationCode,
      value,
      patient,
      facility
    );
    if (res) {
      return res.length;
    }
    return 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const getObservationFromEncounter = async (
  patient: String,
  encounterCode: String,
  observationCode: String
) => {
  try {
    let res = await (
      await FhirApi({
        url: `/Observation?code=${observationCode}${
          encounterCode && `&encounter=${encounterCode}`
        }`,
      })
    ).data;
    return res.entry ? res.entry : [];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const countUniquePatients = async (
  resources: Array<any>,
  list: Boolean = false
) => {
  let patients = [];
  for (let resource of resources) {
    patients.push(resource.resource.subject.reference);
  }
  let unique = [...new Set(patients)];
  return list ? unique : unique.length;
};

export let Patient = (patient: any) => {
  return {
    resourceType: "Patient",
    ...(patient.id && { id: patient.id }),
    meta: {
      profile: [
        "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-patient",
        "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-base-patient",
        "http://fhir.org/guides/who/core/StructureDefinition/who-patient",
      ],
    },
    identifier: [
      {
        value: patient.ancCode,
        id: "ANC_NUMBER",
      } /*the anc number is supposed to be conditionally added for mothers only. Only left since it is required */,
      {
        value: patient.kmhflCode,
        id: "KMHFL_CODE",
      } /* on the frontend when displaying list of patients, for now. */,
      ...(patient.idNumber
        ? [{ value: patient.idNumber, id: "NATIONAL_ID" }]
        : [
            {
              value: patient.birthNotificationNumber,
              id: "BIRTH_NOTIFICATION_NUMBER",
            },
            {
              value: patient.iprNumber,
              id: "IMMUNIZATION_PERMANENT_REGISTER_NUMBER",
            },
            { value: patient.cwcNumber, id: "CHILD_WELFARE_CLINIC_NUMBER" },
            {
              value: patient.birthCertificateNumber,
              id: "BIRTH_CERTIFICATE_NUMBER",
            },
          ]),
    ],
    name: [{ family: patient.names, given: [patient.names] }],
    telecom: [{ value: patient.phone, system: "phone" }],
    gender: patient.sex,
    birthDate: new Date(patient.dob).toISOString().slice(0, 10),
    address: [
      {
        state: patient.county,
        district: patient.subCounty,
        city: patient.ward,
        village: patient.village,
      },
    ],
    contact: patient.nextOfKinName
      ? [
          {
            telecom: [
              {
                value: patient.nextOfKinPhone,
              },
            ],
            name: {
              family: patient.nextOfKinName,
            },
            relationship: [
              {
                text: patient.nextOfKinRelationship,
              },
            ],
          },
        ]
      : [
          {
            telecom: [
              {
                value: patient.motherPhone,
                system: "phone",
              },
            ],
            name: {
              family: patient.motherName,
            },
            relationship: [
              {
                coding: [
                  {
                    system:
                      "https://terminology.hl7.org/6.0.2/CodeSystem-v3-RoleCode.html",
                    code: "MTH",
                    display: "Mother",
                  },
                ],
              },
            ],
          },
        ],
  };
};

export let RelatedPerson = (relatedPerson: any) => {
  return {
    resourceType: "RelatedPerson",
    ...(relatedPerson.id && { id: relatedPerson.id }),
    ...(!relatedPerson.id && { id: uuidv4() }),
    active: true,
    patient: {
      reference: `Patient/${relatedPerson.patientId}`,
    },
    relationship: [
      {
        coding: [
          {
            system: relatedPerson.codingSystem,
            code: relatedPerson.code,
            display: relatedPerson.display,
          },
        ],
      },
    ],
    name: [
      {
        family: relatedPerson.name,
        given: [relatedPerson.name],
      },
    ],
    telecom: [
      {
        system: "phone",
        value: `${relatedPerson.phone}`,
        use: "mobile",
      },
    ],
  };
};

export const Location = (placeOfBirth: string, id: string) => {
  return {
    resourceType: "Location",
    ...(id && { id: id }),
    ...(!id && { id: uuidv4() }),
    status: "active",
    name: placeOfBirth,
    mode: "kind",
  };
};

export const createPractitioner = async (userId: string) => {
  try {
    let user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!(user?.role === "NURSE" || user?.role === "CHW")) {
      console.log(`Practitioner supported for CHW and NURSE users only`);
      return null;
    }
    if (user?.practitionerId) {
      console.log(`Practitioner ${user.practitionerId} already exists`);
      return null;
    }
    let data = {
      resourceType: "Practitioner",
      name: [
        {
          use: "usual",
          text: user?.names,
        },
      ],
    };
    let res = await FhirApi({
      url: `/Practitioner`,
      method: "POST",
      data: JSON.stringify(data),
    });
    await db.user.update({
      where: { id: userId },
      data: { practitionerId: res.data.id },
    });
    return res.data.id;
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export const Practitioner = async (id: string) => {
  try {
    let res = await FhirApi({ url: `/Practitioner/${id}`, method: "GET" });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const Appointment = (appointment: any) => {
  if (appointment.serviceCategory < 1 || appointment.serviceCategory > 5) {
    console.error("Service categories should range from 1 to 4");
    return;
  }

  if (appointment.reason < 1 || appointment.reason > 8) {
    console.error("Appointment reasons should range from 1 to 8");
    return;
  }

  // these are the most common service categories I have identified for appointments in PNC
  // advise if more or less are needed [@moturiphil, @bushisky]
  // 1- Child Development
  // 2- Community Healthcare
  // 3- Counselling
  // 4- General Practice
  // 5- Physical Activities

  const serviceCategoryCoding = () => {
    switch (appointment.serviceCategory) {
      case 1:
        return {
          code: "5",
          display: "Child Development",
        };

      case 2:
        return {
          code: "7",
          display: "Community Health Care",
        };

      case 3:
        return {
          code: "8",
          display: "Counselling",
        };

      case 4:
        return {
          code: "17",
          display: "General Practice",
        };

      default:
        return {
          code: "23",
          display: "Physical Activity & Recreation",
        };
    }
  };

  // and these are the reasons I have identified as most fitting for all PNC appointments
  const appointmentReasonCoding = () => {
    switch (appointment.reason) {
      case 1:
        return {
          code: "413744002",
          display: " Cancer screening follow up",
        };

      case 2:
        return {
          code: "281010000",
          display: "Child development checks",
        };

      case 3:
        return {
          code: "33879002",
          display: "Administration of vaccine to produce active immunity",
        };

      case 4:
        return {
          code: "767224000",
          display: "Administration of vitamin A",
        };

      case 5:
        return {
          code: "709542007",
          display: " Administration of nutritional supplement",
        };

      case 6:
        return {
          code: "14369007",
          display: "Deworming",
        };

      case 7:
        return {
          code: "399256002",
          display: "Polymerase chain reaction test for HIV 1",
        };

      default:
        return {
          code: "409788009",
          display: "Rapid HIV-1 antibody test",
        };
    }
  };

  return {
    resourceType: "Appointment",
    id: appointment.id || uuidv4(),
    status: "booked",
    class: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            code: "AMB",
            display: "ambulatory",
          },
        ],
      },
    ],
    serviceCategory: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/service-category",
            ...{
              ...serviceCategoryCoding(),
            },
          },
        ],
      },
    ],
    appointmentType: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/v2-0276",
          code: "FOLLOWUP",
          display: "A follow up visit from a previous appointment",
        },
      ],
    },
    reasonCode: [
      {
        coding: [
          {
            system: "http://snomed.info/sct",
            ...{
              ...appointmentReasonCoding(),
            },
          },
        ],
      },
    ],
    description: appointment.description,
    start: new Date(appointment.nextVisit).toISOString(),
    end: new Date(appointment.nextVisit).toISOString(),
    created: new Date().toISOString(),
    ...(appointment.note && {
      note: [
        {
          text: appointment.note,
        },
      ],
    }),
    subject: {
      reference: `Patient/${appointment.patientId}`,
    },
    participant: [
      {
        actor: {
          reference: `Patient/${appointment.patientId}`,
          display: appointment.patientName,
        },
        required: "required",
        status: "accepted",
      },
      {
        type: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                code: "ATND",
                display: "attender",
              },
            ],
          },
        ],
        actor: {
          reference: `Practitioner/${appointment.practitionerId}`,
          display: appointment.practitionerName,
        },
        required: "required",
        status: "accepted",
      },
    ],
  };
};

export const Immunization = (immunization:any, vaccineCoding:any, siteCoding:any, routeCoding:any, unitCoding:any) => {
  
  return {
    resourceType: "Immunization",
    id: immunization.id || uuidv4(),
    status: "completed",
    vaccineCode: {
      coding: [
        {
          system: vaccineCoding.system === "snomed" ? "http://snomed.info/sct" :
            vaccineCoding.system === "hl7" ? "http://hl7.org/fhir/sid/cvx" :
              vaccineCoding.system === "urn" ? "urn:oid:1.2.36.1.2001.1005.17" :
                "http://41.89.93.172/fhir",
          code: vaccineCoding.code,
          display: vaccineCoding.display,
        }
      ]
    },
    patient: {
      reference: `Patient/${immunization.patientId}`      
    },
    encounter: {
      reference: `Encounter/${immunization.encounterId}`
    },
    occurrenceDateTime: new Date(immunization.immunizationDate).toISOString(),
    recorded: new Date().toISOString(),
    ...(immunization.manufacturerId && immunization.manufacturerId!=="" && {
      manufacturer: {
        reference: `Organization/${immunization.manufacturerId}`
      }
    }),
    lotNumber: immunization.lotNumber,
    expirationDate: new Date(immunization.expiryDate).toISOString().split("T")[0],
    site: {
      coding: [
        {
          system: siteCoding.system === "snomed" ? "http://snomed.info/sct" :
            siteCoding.system === "hl7" ? "http://terminology.hl7.org/CodeSystem/v3-ActSite" :
              "http://41.89.93.172/fhir",
          code: siteCoding.code,
          display:siteCoding.display,
        }
      ]
    },
    route: {
      coding: [
        {
          system: routeCoding.system === "hl7" ? "http://terminology.hl7.org/CodeSystem/v3-RouteOfAdministration" :
            routeCoding.system === "snomed" ? "http://snomed.info/sct" :
              "http://41.89.93.172/fhir",
          code: routeCoding.code,
          display: routeCoding.display
        }
      ]
    },
    doseQuantity: {
      value: immunization.dosage,
      unit: unitCoding.display,      
      system: "http://unitsofmeasure.org",
      code: unitCoding.code
    },
    performer: [{
      actor: {
        reference: `Practitioner/${immunization.practitionerId}`
      }
    }],
    ...(immunization.additionalComments && immunization.additionalComments!=="" && {
      note: [{
        text:immunization.additionalComments
      }]
    }),
    reasonCode: [{
      coding: [
        {
          system: "http://snomed.info/sct",
          code: "127785005",
          display: "Administration to produce immunity, either active or passive"
        }
      ]
    }],
    ...(immunization.fundingSource && {
      fundingSource: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/immunization-funding-source",
            code: immunization.fundingSourceCode,
            display: immunization.fundingSourceDisplay
          }
        ]
      }
    })
  }
}

export const MedicationRequest = (medication: any, medicationCoding: any, siteCoding: any, routeCoding: any, methodCoding: any, unitCoding: any) => {  

  const categoryCoding = () => {
    
    switch (medication.category) {
      
      case 1:
        return {
          code: "outpatient",
          display: "Outpatient"
        }
      
      default:
        return {
          code: "community",
          display: "Community"
        }
    }
  }
  
  return {
    resourceType: "MedicationRequest",
    id: medication.id || uuidv4(),    
    meta: {
      profile:["http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationRequest-uv-ips"]
    },
    status: "completed",
    intent: "original-order",
    ...(medication.category && medication.category !== "" && {
      category: [{
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
            ...{
              ...categoryCoding()
            }
          }
        ]
      }]
    }),
    priority: "routine",
    medicationCodeableConcept: {
      coding: [
        {
          system: medicationCoding.system === "snomed" ? "http://snomed.info/sct" :
          medicationCoding.system === "ciel" ? "https://CIELterminology.org" :
            "http://41.89.93.172/fhir",
          code: medicationCoding.code,
          display: medicationCoding.display
        }
      ]
    },
    subject: {
      reference: `Patient/${medication.patientId}`
    },
    encounter: {
      reference: `Encounter/${medication.encounterId}`
    },
    authoredOn: new Date().toISOString(),
    requester: {
      reference: `Practitioner/${medication.practitionerId}`
    },
    performer: {
      reference: `Patient/${medication.patientId}` //this indicated who performed the actual administration. For kids, i recommend the mother being
    },                                             //performer
    recorder: {
      reference: `Practitioner/${medication.practitionerId}`
    },
    ...(medication.reason && medication.reason !== "" && {
      reasonCode: [{
        coding: [
          {
            system: medication.system,            
            code: medication.reasonCode,
            display: medication.reasonDisplay
          }
        ]
      }]
    }),
    ...(medication.additionalComments && medication.additionalComments !== "" && {
      note: [{
        text: medication.additionalComments
      }]
    }),
    dosageInstruction: [{
      ...(medication.dosageInstructions && medication.dosageInstruction !== "" && {
        text: medication.dosageInstruction
      }),
      ...(medication.additionalInstruction && medication.additionalInstruction !== "" && {
        additionalInstruction: [{
          coding: [
            {
              system: medication.additionalInstructionSystem,
              code: medication.additionalInstructionCode,
              display: medication.additionalInstructionDisplay
            }
          ]
        }]
      }),
      site: {
        coding: [
          {
            system: siteCoding.system === "snomed" ? "http://snomed.info/sct" :
            siteCoding.system === "hl7" ? "http://terminology.hl7.org/CodeSystem/v3-ActSite" :
              "http://41.89.93.172/fhir",        
            code: siteCoding.code,
            display: siteCoding.display
          }
        ]
      },
      route: {
        coding: [
          {
            system: routeCoding.system === "hl7" ? "http://terminology.hl7.org/CodeSystem/v3-RouteOfAdministration" :
            routeCoding.system === "snomed" ? "http://snomed.info/sct" :
              "http://41.89.93.172/fhir",
            code: routeCoding.code,
            display: routeCoding.display
          }
        ]
      },
      method: {
        coding: [
          {
            system: methodCoding.system === "snomed" ?  "http://snomed.info/sct" : "http://41.89.93.172/fhir",
            code: methodCoding.code,
            display: methodCoding.display
          }
        ]
      },
      doseAndRate: [{
        doseQuantity: {
          value: medication.dosage,
          unit: unitCoding.display,
          system: "http://unitsofmeasure.org",      
          code: unitCoding.code      
        }
      }]
    }]
  }
}

export const AllergyIntolerance = (intolerance: any) => {        
  
  return {
    
    resourceType: "AllergyIntolerance",
    id: intolerance.id || uuidv4(),
    clinicalStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
          code: "active",
          display: "Active"          
        }
      ]
    },
    verificationStatus: {
      coding:
        [
          {
            system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
            code: "confirmed",
            display: "Confirmed"            
        }
      ]
    },
    type: "intolerance",
    category: ["biologic"],
    code: {
      coding: [
        {
          system: "http://snomed.info/sct",
          code: "418038007",
          display: "Propensity to adverse reactions to substance"
        }
      ]
    },
    patient: {
      reference: `Patient/${intolerance.patientId}`
    },
    encounter: {
      reference: `Encounter/${intolerance.encounterId}`
    },
    onsetDateTime: new Date(intolerance.onset).toISOString(),
    recordedDate: new Date().toISOString(),
    recorder: {
      reference: `Practitioner/${intolerance.practitionerId}`
    },
    reaction: [{
      substance: {
        coding: [
          {
            system: intolerance.system,
            code: intolerance.code,
            display: intolerance.display
          }
        ]
      },
      manifestation: [{ //This is hardcoded since the booklet does not provide for a specific reaction manifestation. Should it be
        coding: [       //available later on, this should be changed to dynamically code the manifestation.
          {
            system: "http://snomed.info/sct",
            code: "29544009",
            display: "Intolerance"
          }
        ]
      }],
      description: intolerance.description
    }]
  }
}