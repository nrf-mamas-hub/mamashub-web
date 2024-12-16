import express, { Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import db from '../lib/prisma';
import {
    createEncounter, createObservation, FhirApi, Patient, RelatedPerson, Location, Appointment,
    Immunization, MedicationRequest, AllergyIntolerance
 } from "../lib/utils";
import observationCodes from '../lib/observationCodes.json';
import medicalCodesList from '../lib/medicalCodes.json';
import { decodeSession, requireJWTMiddleware } from "../lib/jwt";
import { parseFhirPatient } from "../lib/utils";
import { getPatients } from "../lib/reports";

const router = express.Router();

router.use(express.json());

let codes: { [index: string]: string } = observationCodes.codes;
let medicalCodes: { [index: string]: string } = medicalCodesList.medicalCodes;

router.post('/observations', async (req: Request, res: Response) => {
    try {
        let { observations, patientId, encounterId } = req.body
        console.log(observations, patientId, encounterId)
        if (!observations || !patientId || !encounterId) {
            res.json({ error: "observations, patientId and encounterId are required", status: "error" })
            return
        }
        let builtObservations: any[] = []
        for (let obs of Object.keys(observations)) {
            let _observation = observations[obs]
            //create observations
            console.log(_observation)
            console.log("Observation", _observation)

            let observationId = uuidv4();
            if (Object.keys(codes).indexOf(obs) > -1) {
                let metaData = codes[obs];
                let coding = {
                    system: metaData.split(":")[0], display: metaData.split(":")[2], code: metaData.split(":")[1]
                }

                // let ov = parseFloat(_observation) ? { valueQuantity: createObservationValue(_observation, metaData.split(":")[3] || "") } : { valueString: _observation }
                let ov = { valueString: _observation }
                console.log(obs)
                let o = createObservation(patientId, ov, coding, observationId, encounterId)
                // console.log(":observation", o)
                FhirApi({ url: `/Observation/${observationId}`, method: 'PUT', data: JSON.stringify(o) })
                // console.log(response.data)
                // console.log(o)
                builtObservations.push(observationId);
            }
            else {
                console.log({ error: `observation key for ${obs} not found`, status: "error" })
                // return
            }
        }
        res.json({ observations: builtObservations, status: "success" })
        return
    } catch (error) {
        console.log(error)
        res.json({ error: JSON.stringify(error), status: "error" })
        return
    }
})

router.get('/observations', [], async (req: Request, res: Response) => {
    try {
        let { patientId, encounter, count } = req.query;
        let response;
        if (encounter) {
            response = await (await FhirApi({ url: `/Observation?encounter=${encounter}&_count=${count ?? 50}` })).data
        }
        if (patientId) {
            response = await (await FhirApi({ url: `/Observation?patient=${patientId}&_count=${count ?? 50}` })).data
        }
        if (!patientId && !encounter) {
            response = await (await FhirApi({ url: `Observation?_count=${count ?? 50}` })).data
        }
        res.json({ observations: response.entry || [], status: "success" })
        return
    } catch (error) {
        console.log(error);
        res.json({ error: error, status: "error" });
        return;
    }
})

router.post('/encounters', [requireJWTMiddleware], async (req: Request, res: Response) => {
    try {
        let { encounterCode, patientId, encounterType, locationId } = req.body;

        let encounterId = uuidv4();
        let encounter = createEncounter(patientId, encounterId, encounterType ?? 2, encounterCode, locationId);
        let response = await (await FhirApi({
            url: `/Encounter/${encounterId}`,
            data: JSON.stringify(encounter),
            method: 'PUT',
        })).data;
        res.json({ status: "success", id: response.id, encounter: encounter })
        return;
    } catch (error) {
        res.json({ error, status: "error" });
        return;
    }
})

router.get('/encounters', [requireJWTMiddleware], async (req: Request, res: Response) => {
    try {
        let { patient, encounterCode, count } = req.query
        console.log(patient)
        let response = await (await FhirApi({ url: `/Encounter?patient=${patient}${encounterCode ? `&reason-code=${encounterCode}` : ''}&_count=${count || 50}&_sort=-date` })).data
        console.log(response)
        res.json({ encounters: response.entry ?? [], status: "success" })
        return;
    } catch (error) {
        res.json({ error, status: "error" })
        return;
    }
})

router.get('/observation', [], async (req: Request, res: Response) => {
    try {
        let { patient, observationCode, observation } = req.query;
        if (!patient) {
            res.statusCode = 400;
            res.json({ error: "patient is required", status: "error" })
            return;
        }
        console.log(patient);
        let response = await (await FhirApi({ url: `/Observation?sort=-date&patient=${patient}${observationCode ? `&code=${observationCode}` : ''}` })).data;
        console.log(response);

        if (response.entry && (observationCode || observation)) {
            res.statusCode = 200;
            res.json({ [observationCode?.toString() || "data"]: response.entry[0].resource.valueString || null, status: "success" })
            return;
        }
        res.statusCode = 200;
        res.json({ observations: response.entry || [], status: "success" })
        return;
    } catch (error) {
        res.statusCode = 400;
        res.json({ error, status: "error" })
        return;
    }
})



router.get('/patients', [requireJWTMiddleware], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || null;
        if (!token) {
            res.statusCode = 401;
            res.json({ error: "Invalid access token", status: "error" });
            return;
        }
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1]);
        if (decodedSession.type == 'valid') {
            let userId = decodedSession.session.userId;
            let user = await db.user.findFirst({
                where: {
                    id: userId
                }
            });
            //get args..

            console.log(user?.facilityKmhflCode)

            let patients = await getPatients(undefined, undefined, user?.facilityKmhflCode)
            console.log(patients.length)
            // let patients = await (await FhirApi({ url: `/Patient?_count=1000` })).data?.entry || [];
            let _patients = [];
            for (let patient of patients) {
                _patients.push({ ...patient.resource, text: null });
            }
            // console.log(_patients.length);
            res.json({ patients: _patients, status: "success", count: _patients.length });
            return;
        }
        res.statusCode = 401;
        res.json({ error: "Invalid access token", status: "error" });
        return;
    } catch (error) {
        res.json({ error, status: "error" });
        return;
    }
})


//delete patient
router.delete('/patients/:id', [requireJWTMiddleware], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || null;
        let { id } = req.params;
        let response = await FhirApi({ url: `/Patient/${id}?_cascade=delete`, method: "DELETE" })
        console.log(response);
        res.json({ message: "Created patient successfully", status: "success" });
        return;

    } catch (error) {
        res.json({ error, status: "error" });
        return;
    }
})


//get single patient details
router.get('/patients/:id', [requireJWTMiddleware], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || null;
        let { id } = req.params;
        let response = await (await FhirApi({ url: `/Patient/${id}`, method: "GET" })).data
        let patient = parseFhirPatient(response)
        console.log(patient)
        res.json({ patient: patient, status: "success", id });
        return;

    } catch (error) {
        console.log(error);
        res.json({ error, status: "error" });
        return;
    }
})


//create patient
router.post('/patients/:id', [requireJWTMiddleware], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || null;
        let { id } = req.params;
        let response = await FhirApi({ url: `/Patient/${id}`, method: "PUT", data: JSON.stringify(Patient(req.body)) })
        console.log(response);
        res.json({ message: "Created patient successfully", status: "success" });
        return;

    } catch (error) {
        res.json({ error, status: "error" });
        return;
    }
});

// update client (mother) PNC number
router.patch('/patients/:id', [requireJWTMiddleware], async (req: Request, res: Response) => {
    
    try {

        let token = req.headers.authorization || null;
        let { id } = req.params;
        let { pncCode } = req.body;
        
        const patchContent = [
            {
                "op": "add",
                "path": "/identifier/-",
                "value": {
                    "value": pncCode,
                    "id": "PNC_NUMBER"
                }
            }
        ];

        await FhirApi({ url: `/Patient/${id}`, method: "PATCH", headers: { "Content-Type": "application/json-patch+json" }, data: JSON.stringify(patchContent) });        
        
        res.json({ message: "Client PNC number updated successfully", status: "success" });
    } catch (error) {
        res.json({ error, status: "error" });
        return;
    }
})

// create RelatedPerson
router.post("/related-person", [requireJWTMiddleware], async (req: Request, res: Response) => {
    
    try {

        const { father, guardian, relatedPerson } = req.body;

        if (!father.name && !guardian.name) {

            res.statusCode = 400;

            res.json({ error: "Father or guardian name is required", status: "error" })

            return;
        }

        let relatedpeople: any[] = [];

        for (let prop of Object.keys(req.body)) {

            // dont loop over the related person property
            if (prop === "relatedPerson") {
                continue;
            }

            // also skip over objects with no name
            if (!req.body[prop].name) {
                continue;
            }

            let relatedPersonId = uuidv4();

            const codingDetails: any = {
                father: {
                    codingSystem: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
                    code: "FTH",
                    display: "Father",
                },
                default: {
                    codingSystem: "http://terminology.hl7.org/CodeSystem/v3-RoleClass",
                    code: "GUARD",
                    display: " Guardian"
                }
            }

            const { codingSystem, code, display } = codingDetails[prop] || codingDetails.default;

            const relatedPersonDetails = {
                ...req.body[prop],
                id: relatedPersonId,
                patientId: relatedPerson,
                codingSystem: codingSystem,
                code: code,
                display: display
            }

            await FhirApi({ url: `/RelatedPerson/${relatedPersonId}`, method: "PUT", data: JSON.stringify(RelatedPerson(relatedPersonDetails)) });

            relatedpeople.push(relatedPersonId);
        }

        res.json({ relatedPeople: relatedpeople, status: "success" });
        return;
    }
    catch (err) {
        res.statusCode = 400;
        res.json({ err, status: "error" });
    }
});

router.post("/location", [requireJWTMiddleware], async (req: Request, res: Response) => {

    try {

        const { location } = req.body;

        if (!location) {
            res.statusCode = 400;
    
            res.json({ error: "Location is required", status: "error" });
    
            return;
        }
    
        let locationId = uuidv4();

        let result = await FhirApi({ url: `/Location/${locationId}`, method: "PUT", data: JSON.stringify(Location(location, locationId)) });
        
        console.log(result);

        res.json({ status: "success", locationId });
        
    } catch (err) {
        res.json({ err, status: "error" });
    }
    
});

router.post("/appointment", [requireJWTMiddleware], async (req: Request, res: Response) => {

    try {

        let id = uuidv4();
        
        let appointmentDetails = {
            id,
            ...req.body
        }

        let appointment = Appointment(appointmentDetails);

        await FhirApi({ url: `/Appointment/${id}`, method: "PUT", data: JSON.stringify(appointment) });

        res.json({ status: "success", appointmentId: id });
        
    } catch (err) {
        res.json({ err, status: "error" });
    }
});

router.post("/immunization", [requireJWTMiddleware], async (req: Request, res: Response) => {
    
    try {

        let id = uuidv4();

        const { patientId, encounterId, practitionerId, manufacturerId, vaccine } = req.body;
        const { expiryDate, immunizationDate, lotNumber, dosage, additionalComments, unit } = vaccine;
    

        let codings: { [key: string]: any } = {};
        
        for (let prop of Object.keys(vaccine)) {
                
            if (prop !== "site" && prop !== "name" && prop !== "route" && prop !== "unit") {
                continue;
            }

            const medicalCodesKeys = vaccine[prop];

            if (Object.keys(medicalCodes).indexOf(medicalCodesKeys) > -1) {

                let propWithCodingVariable = `${prop}Coding`;

                let codingData = medicalCodes[medicalCodesKeys];

                let coding = {
                    system: codingData.split(":")[0], code: codingData.split(":")[1], display: codingData.split(":")[2]
                }
                    
                codings = {
                    ...codings,
                    [propWithCodingVariable]: coding
                }
            } else {
                console.log(`Error: property ${prop} not found`)
            }
        }

        let { nameCoding: vaccineCoding, siteCoding, routeCoding, unitCoding } = codings;

        const immunization = {
            id,
            patientId,
            encounterId,
            practitionerId,
            manufacturerId,
            immunizationDate,
            lotNumber,
            expiryDate,
            dosage,
            additionalComments,
            dosageUnit: unit,
        }

        const immmunizationDetails = Immunization(immunization, vaccineCoding, siteCoding, routeCoding, unitCoding);

        await FhirApi({ url: `/Immunization/${id}`, method: "PUT", data: JSON.stringify(immmunizationDetails) });

        res.json({ status: "success", immunizationId: id });
        
    } catch (err) {
        res.json({ err, status: "error" });
    }
});

router.post("/medication-request", [requireJWTMiddleware], async (req: Request, res: Response) => {
    
    try {

        let medicationRequestIds: { medication: string, status: string, medicationRequestId: string }[] = [];

        for (let medication of Object.keys(req.body)) {

            let id = uuidv4();

            let administrationCodings: { [key: string]: any } = {};
            let medicationCoding: {} = {};
            
            if (Object.keys(medicalCodes).indexOf(medication) > -1) {

                medicationCoding = {
                    ...medicationCoding,
                    system: medicalCodes[medication].split(":")[0], code: medicalCodes[medication].split(":")[1], display: medicalCodes[medication].split(":")[2]
                }

                for (let administration of Object.keys(req.body[medication])) {

                    if (administration !== "site" && administration !== "method" && administration !== "route" && administration !== "unit") {
                        continue;
                    };

                    let administrationWithCodingVariable = `${administration}Coding`;
                    let administrationDetails = req.body[medication][administration];

                    if (Object.keys(medicalCodes).indexOf(administrationDetails) > -1) {
                        
                        let codingData = medicalCodes[administrationDetails];

                        let coding = {
                            system: codingData.split(":")[0], code: codingData.split(":")[1], display: codingData.split(":")[2]
                        }

                        administrationCodings = {
                            ...administrationCodings,
                            [administrationWithCodingVariable]: coding,
                        };
                    }
                }
            
            } else {
                console.log(`Error: property ${medication} not found`);
            }

            const { siteCoding, routeCoding, methodCoding, unitCoding } = administrationCodings;
            const medicationRequestDetails = MedicationRequest({ id, ...req.body[medication] }, medicationCoding, siteCoding, routeCoding, methodCoding, unitCoding);
            
            await FhirApi({ url: `/MedicationRequest/${id}`, method: "PUT", data: JSON.stringify(medicationRequestDetails) });
            
            medicationRequestIds.push({ medication, status: "success", medicationRequestId: id });
        }
        
        res.json({ status: "success", data: medicationRequestIds });
    } catch (err) {
        res.json({ err, status: "error" });
    }
});

router.post("/allergy-intolerance", [requireJWTMiddleware], async (req: Request, res: Response) => {
    
    try {

        let id = uuidv4();

        const { patientId, vaccine } = req.body;

        const getVaccineCoding = () => {

            if (Object.keys(medicalCodes).indexOf(vaccine) > -1) {            
                return ({ status: "success", data: medicalCodes[vaccine] });                
            } else {
                return ({status:"error", data:`Error: property ${vaccine} not found`});
            }
        }

        const { status, data } = getVaccineCoding();

        if (status !== "success") {
            res.statusCode = 400;
            res.json(data);            
            return;
        }

        const vaccineCode = data.split(":")[1];

        // retrieve last administered vaccine matching the suspected cause substance for given child
        let lastSimilarSubstance = await (await FhirApi({ url: `/Immunization?patient=${patientId}&vaccine-code=${vaccineCode}&_sort=-_lastUpdated`, method: "GET" })).data;

        let vaccineDetails: { [key: string]: any } = {}        

        if (lastSimilarSubstance.total < 1) {   
            
            vaccineDetails = {
                ...vaccineDetails,
                system: data.split(":")[0] === "snomed" ? "http://snomed.info/sct" :                    
                    data.split(":")[0] === "hl7" ? "http://hl7.org/fhir/sid/cvx" :                        
                        data.split(":")[0] === "urn" ? "urn:oid:1.2.36.1.2001.1005.17" :                            
                            "http://41.89.93.172/fhir",
                code: vaccineCode,
                display: data.split(":")[2]                
            }
        } else {
            vaccineDetails = {
                ...vaccineDetails,
                ...lastSimilarSubstance.entry[0].resource.vaccineCode.coding[0]                
            }
        }

        let { system, code, display } = vaccineDetails;

        let allergyIntoleranceDetails = {
            id, 
            ...req.body,
            system, 
            code,
            display,
        }

        await FhirApi({ url: `/AllergyIntolerance/${id}`, method: "PUT", data: JSON.stringify(AllergyIntolerance(allergyIntoleranceDetails)) });

        res.json({ status: "success", allergyIntoleranceId: id });
        
    } catch (error) {
        res.statusCode = 404;
        res.json({ error, status: "error" });
    }
});

export default router