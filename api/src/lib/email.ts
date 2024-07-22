import mailjet from 'node-mailjet'

let maijetClient = mailjet.connect(process.env['MAILJET_API_KEY'] as string, process.env['MAILJET_API_SECRET'] as string )

export async function sendEmail(data: {subject: string, to: {email:string, name: string}, from: {name:string, email: string}, body: string, html: string}){
    let response = await maijetClient.post("send", {'version':'v3.1'}).request({
        "Messages":[
            {
                "From":{
                    "Email": data.from.email,
                    "Name": data.from.name
                },
                "To":[{
                    "Email":data.to.email,
                    "Name":data.to.name
                }],
                "Subject": data.subject,
                "TextPart":data.body,
                "HTMLPart": data.html
            }
        ]
    })
    return response

}


export const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

export let sendPasswordResetEmail = async (user:any, resetLink:string) => {

    try {
        let response = await sendEmail({
            subject: "Reset Password: Mama's Hub",
            to:{
                email:user.email as string,
                name: user.names as string
            },
            from:{
                name: "Mama's Hub",
                email: "okemwawes@gmail.com"
            },
            body: `Dear ${user.names},\n\n\nUse the link below to reset your password \n\n${resetLink}`,
            html: ""
        })
        return response
    } catch (error) {
        console.error(error)
        return error
    }
}


export let sendWelcomeEmail = async (user:any, resetLink:string) => {

    try {
        let response = await sendEmail({
            subject: "Welcome to Mama's Hub",
            to:{
                email:user.email as string,
                name: user.names as string
            },
            from:{
                name: "Mama's Hub",
                email: "okemwawes@gmail.com"
            },
            body: `Dear ${user.names},\n\n\nUse the link below to create your password \n\n${resetLink}`,
            html: "",
        })
        return response
    } catch (error) {
        console.error(error)
        return error
    }
}