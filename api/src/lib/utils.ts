import fetch from 'cross-fetch'
import { v4 as uuidv4 } from 'uuid'
import { reports } from './allReports.json'
import { getPatients } from './reports'
import * as observationCodes from "./observationCodes.json"

import db from './prisma'

export let codes: any = observationCodes.codes;

let codesIndex: any = {}
Object.keys(codes).map((code: string) => {
    codesIndex[codes[code].split(":")[1]] = code;
})

export let indexedCodes = codesIndex;

export const parseIdentifiers = async (patientId: string | null = null, patientResource: any | null = null) => {
    try {
        if (patientId) {
            let patient = (await FhirApi({ url: `/Patient/${patientId}`, })).data
            if (!(patient?.total > 0 || patient?.entry.length > 0)) {
                return null;
            }
            let identifiers = patient.entry[0].resource.identifier;
            return identifiers.map((id: any) => {
                return {
                    [id.id]: id
                }
            })
        } else if (patientResource) {
            let identifiers = patientResource.identifier;
            return identifiers.map((id: any) => {
                return {
                    [id.id]: id
                }
            })
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}



export const getRegistrationDate = async (patientId: string | null = null, patientResource: any | null = null) => {
    try {
        if (patientId) {
            let patient = await (await FhirApi({ url: `/Patient/${patientId}/_history/1` })).data;
            return patient.meta.lastUpdated;
        }
        else if (patientResource) {
            return patientResource.meta.lastUpdated;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const filterPatientsByRegistrationDate = async (kmhflCode: string, from: Date, to: Date) => {
    try {
        let _patients = await (await FhirApi({ url: `/Patient/_history/1` })).data;
        let patients = [];
        for (let patient of _patients) {
            let registrationDate = await getRegistrationDate(null, patient.resource);
            let identifiers = await parseIdentifiers(null, patient);
            if (registrationDate >= from && registrationDate <= to && identifiers.KMHFL_CODE.value === kmhflCode) {
                patients.push(patient.resource);
            }
        }
        return patients;
    } catch (error) {
        console.log(error);
        return [];
    }
}



// parseIdentifiers("KE-2023-01-FBE66").then((res)=> {
//     console.log(res)
// })
export const parseFhirPatient = (patient: any) => {
    
    let identifiers = patient.identifier || [];
    let _ids: any = {}

    if (Array.isArray(identifiers)) {
        
        for (let id of identifiers) {
            _ids[id.id] = id
        }
    }

    const standardPatientInfo = {
        id: patient.id,
        fullNames: patient.name[0].family,
        ancNumber: _ids.ANC_NUMBER?.value || '',
        idNumber: _ids.NATIONAL_ID?.value || '',
        otherNames: patient.name[0].given[0],
        sex: patient.gender,
        dob: new Date(patient.birthDate).toDateString(),
        // maritalStatus: patient.maritalStatus.coding[0].display,
        deceased: patient.deceasedBoolean,
        phone: patient.telecom[0].value,
        country: patient.address[0].country,
        ward: patient.address[0].city,
        county: patient.address[0].state,
        subCounty: patient.address[0].district,
    }

    // check whether client is a mother or child using the next of kin property
    // this property is required for mothers during ANC registration, unlike for new borns
    const nextOfKinRelationship = patient.contact[0]?.relationship[0]?.text || '';

    if (nextOfKinRelationship) {
        return {
            ...standardPatientInfo,
            pncNumber: _ids.PNC_NUMBER?.value || '',        
            nextOfKinRelationship: nextOfKinRelationship,
            nextOfKinName: patient.contact[0].name.family,
            nextOfKinPhone: patient.contact[0].telecom[0].value,
        }
    } else {
        return {
            ...standardPatientInfo,
            motherName: patient.contact[0].name.family,
            motherPhone: patient.contact[0].telecom[0].value,
            fatherName: patient.contact[1].name.family,
            fatherPhone: patient.contact[1].telecom[0].value,
            guardianName: patient.contact[2].name.family,
            guardianPhone: patient.contact[2].telecom[0].value
        }
    }
}




export const createObservationValue = (value: number, unit: any) => {
    return { value, unit, system: "http://unitsofmeasure.org" }
}

export const createObservation = (patientId: string, observationValue: any, coding: any, id: string, encounterId: string) => {
    return {
        "resourceType": "Observation",
        ...(id) && { "id": id },
        ...(!id) && { "id": uuidv4() },
        status: "final",
        code: {
            coding: [
                {
                    "system": (coding.system === "snomed") ? "http://snomed.info/sct" : (coding.system === "loinc") ? "http://loinc.org" : "http://intellisoftkenya.com",
                    "code": coding.code,
                    "display": coding.display
                }
            ]
        },
        subject: { reference: `Patient/${patientId}` },
        encounter: { reference: `Encounter/${encounterId}` },
        ...observationValue,
        effectiveDateTime: new Date().toISOString(),
        issued: new Date().toISOString(),
        meta: {
            "profile": [
                "http://fhir.org/guides/who/core/StructureDefinition/who-observation",
                "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-observation",
                "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-b4-de1"
            ]
        },
    }
}


export const createEncounter = (patientId: string, encounterId: string, encounterType: number = 2, encounterCode: string | null = null) => {
    if (encounterType > 3 || encounterType < 1) {
        console.error("Encounter type is either 1, 2 or 3")
        return
    }
    return {
        resourceType: "Encounter", 
        id: encounterId,
        reference: {
            "patient": `Patient/${patientId}`
        },
        "meta": {
            "profile": [
                "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-encounter",
                "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-base-encounter",
                "http://fhir.org/guides/who/core/StructureDefinition/who-encounter"
            ]
        },
        "identifier": [
            {
                "use": "official",
                "system": "http://example.org/fhir/NamingSystem/identifiers",
                "value": encounterId
            }
        ],
        "subject": {
            "reference": `Patient/${patientId}`
        },
        "period": {
            "start": new Date().toISOString(),
            "end": new Date().toISOString()
        },
        "reasonCode": [
            {
                "coding": [
                    (encounterType === 1) ? {
                        "system": "http://fhir.org/guides/who/anc-cds/CodeSystem/anc-custom-codes",
                        "code": encounterCode,
                        "display": "First antenatal care contact"
                    } : (encounterType === 2) ?
                        {
                            "system": "http://fhir.org/guides/who/anc-cds/CodeSystem/anc-custom-codes",
                            "code": encounterCode,
                            "display": "Scheduled antenatal care contact"
                        } :
                        {
                            "system": "http://fhir.org/guides/who/anc-cds/CodeSystem/anc-custom-codes",
                            "code": encounterCode,
                            "display": "Specific complaint related to antenatal care"
                        }
                ]
            }
        ]
    }
}



// create location resources
export let registerFacility = async () => {
    return 8
}


export let apiHost = process.env.FHIR_BASE_URL

export const FhirApi = async (params: any) => {
    let _defaultHeaders = { "Content-Type": 'application/json' }
    if (!params.method) {
        params.method = 'GET';
    }
    try {
        let response = await fetch(String(`${apiHost}${params.url}`), {
            headers: params.headers ? params.headers:_defaultHeaders,
            method: params.method ? String(params.method) : 'GET',
            ...(params.method !== 'GET' && params.method !== 'DELETE') && { body: String(params.data) }
        });
        let responseJSON = await response.json();
        let res = {
            status: "success",
            statusText: response.statusText,
            data: responseJSON
        };
        return res;
    } catch (error) {
        console.error(error);
        let res = {
            statusText: "FHIRFetch: server error",
            status: "error",
            data: error
        };
        console.error(error);
        return res;
    }
}

export const generateReport = async (name: any) => {
    const reportName = name as keyof typeof reports
    let report = reports[reportName]
    // console.log(report)
    let data = await FhirApi({ url: report.q });
    if (data.status === 'success') {
        // console.log(data.data[report.query])
        if (report.query !== "entry") {
            return parseFloat(((data.data[report.query]) || 0).toString());
        }
        else {
            return (data.data[report.query] || []);
        }
    }
    return parseFloat("0.0")
}



export let clearEncounters = async (patient: string | null, code: string | null = null) => {

    let _encounters = (await FhirApi({ url: `/Encounter?${(patient && code) ? `patient=${patient}&reason-code=${code}` : code ? `reason-code=${code}` : patient ? `patient=${patient}` : ''}` })).data
    let encounters: any = _encounters.entry ?? []
    console.log(_encounters)
    for (let encounter of encounters) {
        console.log(encounter.resource.id)
        let res = await (await FhirApi({ url: `/Encounter/${encounter.resource.id} `, method: "DELETE" })).data
        console.log(res)

    }
}


export let clearObservations = async (patient: string | null, code: string | null = null) => {

    let _observations = (await FhirApi({ url: `/Observation?${(patient && code) ? `patient=${patient}&code=${code}` : code ? `code=${code}` : patient ? `patient=${patient}` : ''} ` })).data
    let observations: any = _observations.entry ?? [];
    // console.log(_observations);
    for (let observation of observations) {
        // console.log(observation)
        let res = await FhirApi({ url: `/Observation/${observation.resource.id}`, method: "DELETE" });
    }
}


//PATIENT UTILS
export const getPatientByIdentifier = async (ancNumber: string | null = null, idNumber: string | null = null) => {
    try {
        let res = await (await FhirApi({ url: `/Patient?identifier=${idNumber ?? ancNumber}` })).data;
        // console.log(res)
        return res.entry[0].resource || null;
    } catch (error) {
        console.log(error);
        return null;
    }
}


export const getAllPatientsObservations = async (patientId: string, from: Date | null = null, to: Date | null = null) => {
    try {
        let observations = await (await FhirApi({ url: `/Observation?patient=${patientId}&_count=100000&` })).data
        // console.log(observations)
        if (observations.total > 0) {
            let _observations: any = {}
            observations = observations.entry;
            for (let observation of observations) {
                let value = observation.resource.valueQuantity ? observation.resource.valueQuantity.value : (observation.resource.valueString || observation.resource.valueDateTime || "-");
                _observations[getObservationCode(observation.resource)] = value;
            }
            // console.log(_observations);
            return _observations;
        }
        return {}

    } catch (error) {
        console.log(error);
        return {}
    }

}

export const getAllPatientsObservationsMapped = async (patientId: string, from: Date | null = null, to: Date | null = null) => {
    try {
        let observations = await getAllPatientsObservations(patientId, from, to);
        let _map: any = {};
        Object.keys(observations).map((observation: string) => {
            _map[codesIndex[observation]] = observations[observation]
        })
        // console.log(_map)
        return _map
    } catch (error) {
        console.log(error);
        return {}
    }

}

// getAllPatientsObservationsMapped("059dc9eb-790c-48d4-85ea-9c83fa7498f1")


//OBSERVATION UTILS
export const getObservationCode = (observation: any) => {
    try {
        let code = observation.code.coding[0].code;
        return code
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getObservationsWhere = async (observationCode: string, value: any | null, facility: string | null = null) => {
    try {
        let observations = [];
        let patients = await getPatients(undefined, undefined, facility);
        for (let patient of patients) {
            // console.log(patient);
            let res = await (await FhirApi({ url: `/Observation?patient=${patient.resource.id}&code=${observationCode}${value && `&value-string=${value}`}` })).data
            if (res.entry) {
                observations.push(res);
            }
        }
        return observations;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const countObservationsWhere = async (observationCode: string, value: any | null = null, facility: string | null = null) => {
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
}

// ENCOUNTER UTILS
export const getEncountersWhere = async (encounterCode: string, value: any, patient: string | null, facility: string | null = null) => {
    try {
        let encounters = [];
        let res = await (await FhirApi({ url: `/Encounter?reason-code=${encounterCode}` })).data
        return res.entry ? res.entry : [];
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const countEncountersWhere = async (observationCode: string, value: any, patient: string | null, facility: string | null = null) => {
    try {
        let res = await getEncountersWhere(observationCode, value, patient, facility);
        if (res) {
            return res.length;
        }
        return 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}


export const getObservationFromEncounter = async (patient: String, encounterCode: String, observationCode: String) => {
    try {
        let res = await (await FhirApi({ url: `/Observation?code=${observationCode}${encounterCode && `&encounter=${encounterCode}`}` })).data
        return res.entry ? res.entry : [];
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const countUniquePatients = async (resources: Array<any>, list: Boolean = false) => {
    let patients = [];
    for (let resource of resources) {
        patients.push(resource.resource.subject.reference);
    }
    let unique = [...new Set(patients)];
    return list ? unique : unique.length;
}



export let Patient = (patient: any) => {
    return {
        resourceType: 'Patient',
        ...(patient.id && { id: patient.id }),
        meta: {
            profile: [
                'http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-patient',
                'http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-base-patient',
                'http://fhir.org/guides/who/core/StructureDefinition/who-patient',
            ],
        },
        identifier: [
            { "value": patient.idNumber, "id": "NATIONAL_ID" },
            { "value": patient.ancCode, "id": "ANC_NUMBER" },
            { "value": patient.kmhflCode, "id": "KMHFL_CODE" },
        ],
        name: [
            { family: patient.names, given: [patient.names], },
        ],
        telecom: [{ value: patient.phone, system:"phone" },],
        birthDate: new Date(patient.dob).toISOString().slice(0, 10),
        address: [
            {
                state: patient.county,
                district: patient.subCounty,
                city: patient.ward,
                village: patient.village
            },
        ],
        contact: [
            {
                telecom: [
                    {
                        value: patient.nextOfKinPhone,
                    },
                ],
                name: {
                    family: patient.nextOfKinName,
                },
                relationship: [{
                    text: patient.nextOfKinRelationship
                }]
            },
            {
                telecom: [
                    {
                        value: patient.motherPhone,
                        system: "phone"
                    }
                ],
                name: {
                    family: patient.motherName
                },
                relationship: [
                    {
                        coding: [
                            {
                                system: "https://terminology.hl7.org/6.0.2/CodeSystem-v3-RoleCode.html",
                                code: "MTH",
                                display:"Mother"
                            }
                        ]
                    }                    
                ]
            },
            {
                telecom: [
                    {
                        value: patient.fatherPhone,
                        system: "phone"
                    }
                ],
                name: {
                    family: patient.fatherName                    
                },
                relationship: [
                    {
                        coding: [
                            {
                                system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
                                code: "FTH",
                                display:"Father"
                            }
                        ]
                    }
                ]
            },
            {
                telecom: [
                    {
                        value: patient.guardianPhone,
                        system: "phone"                        
                    }
                ],
                name: {
                    family: patient.guardianName
                },
                relationship: [
                    {
                        coding: [
                            {
                                system: "http://terminology.hl7.org/CodeSystem/v3-RoleClass",
                                code: "GUARD",
                                display: "Guardian"
                            }
                        ]
                    }
                ]
            }
        ],
    };
};



export const createPractitioner = async (userId: string) => {
    try {
        let user = await db.user.findFirst({
            where: {
                id: userId
            }
        });
        if (!(user?.role === "NURSE" || user?.role === "CHW")){
            console.log(`Practitioner supported for CHW and NURSE users only`)
            return null;
        }
        if (user?.practitionerId) {
            console.log(`Practitioner ${user.practitionerId} already exists`);
            return null;
        }
        let data = {
            resourceType: "Practitioner",
            name: [{
                "use": "usual",
                "text": user?.names
            }]
        }
        let res = await FhirApi({ url: `/Practitioner`, method: "POST", data: JSON.stringify(data) });
        await db.user.update({
            where: { id: userId }, data: { practitionerId: res.data.id }
        });
        return res.data.id;
    } catch (error) {
        // console.error(error);
        return null;
    }
}

export const Practitioner = async (id: string) => {
    try {
        let res = await FhirApi({ url: `/Practitioner/${id}`, method: "GET" });
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
