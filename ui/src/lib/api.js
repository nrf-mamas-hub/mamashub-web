import { getCookie } from './cookie';

export let apiHost = (process.env['REACT_APP_NODE_ENV'] === "development") ? "http://127.0.0.1:5000" : process.env['REACT_APP_API_URL'];

export let createEncounter = async (patientId, encounterCode, locationId) => {
    try {
        let encounter = await (await fetch(`${apiHost}/crud/encounters`, {
            method: 'POST',
            body: JSON.stringify({
                encounterCode,
                patientId: patientId,
                locationId
            }),
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${getCookie("token")}`,
            }
        })).json()
        return encounter.encounter
    } catch (error) {
        return null
    }
}

export let FhirApi = async (params) => {
    let _defaultHeaders = {
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${getCookie("token")}`,
    }
    //To-do: replace with basicAuth configuration
    try {
        let response = await fetch(String(`${apiHost}${params.url}`), {
            headers: _defaultHeaders,
            method: params.method ? String(params.method) : 'GET',
            ...(params.method !== 'GET') && (params.method !== 'DELETE') && (params.method) && { body: String(params.data) }
        })
        let responseJSON = await response.json()
        let res = {
            status: "success",
            statusText: response.statusText,
            data: responseJSON
        }
        return res
    } catch (error) {
        console.error(error)
        let res = {
            statusText: "FHIRFetch: server error",
            status: "error",
            error: error
        }
        console.error(error)
        return res
    }
    //To-do: process response and response type
}

export const createLocation = async (location) => {    
    
    try {

        let res = await (await FhirApi({
            url: `/crud/location`,
            method: "POST",
            data: JSON.stringify({
                location
            })
        })).data;

        return res;
        
    } catch (error) {
        return null
    }
}

export const createAppointment = async (appointmentDetails) => {        

    try {

        let res = await (await FhirApi({
            url: `/crud/appointment`,
            method: "POST",
            data: JSON.stringify(appointmentDetails)
        })).data;

        return res;
        
    } catch (error) {
        return null
    }
}

export const createImmunization = async (immunizationDetails) => {
    
    try {

        let res = await (await FhirApi({
            url: `/crud/immunization`,
            method: "POST",
            data: JSON.stringify({
                patientId: immunizationDetails.patientId,
                encounterId: immunizationDetails.encounterId,
                practitionerId: immunizationDetails.practitionerId,
                manufacturerId:immunizationDetails.manufacturerId,
                vaccine: {
                    name: immunizationDetails.name,
                    immunizationDate: immunizationDetails.immunizationDate,
                    lotNumber: immunizationDetails.lotNumber,
                    expiryDate: immunizationDetails.expiryDate,
                    site: immunizationDetails.site,
                    route: immunizationDetails.route,
                    dosage: immunizationDetails.dosage,
                    additionalComments: immunizationDetails.additionalComments,
                    unit: immunizationDetails.unit
                }
            })
        })).data;

        return res;
        
    } catch (error) {
        return null;
    }
}
