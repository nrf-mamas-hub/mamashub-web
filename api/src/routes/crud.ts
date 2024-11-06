import express, { Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import db from '../lib/prisma';
import { createEncounter, createObservation, FhirApi, Patient, RelatedPerson, Location } from "../lib/utils";
import observationCodes from '../lib/observationCodes.json';
import { decodeSession, requireJWTMiddleware } from "../lib/jwt";
import { parseFhirPatient } from "../lib/utils";
import { getPatients } from "../lib/reports";

const router = express.Router();

router.use(express.json());

let codes: { [index: string]: string } = observationCodes.codes;

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
        console.log(locationId);
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

        await FhirApi({ url: `/Location/${locationId}`, method: "PUT", data: JSON.stringify(Location(location, locationId)) })

        res.json({status:"success", locationId});
        
    } catch (err) {
        res.json({ err, status: "error" });
    }
    
})

export default router