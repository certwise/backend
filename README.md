### TEMAPLATES

#### POST : /template/create

    {
        name
        uid(ownerID)
        canvas:{
            items:[item1, item2...]
            baseImageSize:{
                x
                y
            }
        }
    }

#### UPDATE : /template/save

    {
        templateId
        template:{
            ...template
        }
    }

#### DELETE : /template/delete/:id

#### GET : /template/get/:id

#### GET : /template/get/users/:uid

## Certtificates

#### POST /certificate/create/one

    {
        templateId
        ownerId
        fields:{

        }
        receiver:{
            ..receiverData
        }
    }

#### POST /certificate/create/bulk

    {
        templateId
        ownerId
        fields:[
            {receiver1}
            {receiver2}
            ...
            ...
            ...
        ]
        receiver:[ //in same order as fields
            {receiver1Data}
            {receiver2Data}
            ...
            ...
            ...
        ]
    }

#### GET /certificate/get/one/:id

#### GET /certificate/get/all/:uid

#### GET /certificate/get/template/:templateid

#### GET /certificate/get/one/name/:name

#### GET /certificate/get/one/email/:email

#### UPDATE /certificate/update/one/:id

#### UPDATE /certificate/update/bulk

#### DELETE /certificate/delete/one/:id

#### DELETE /certificate/delete/bulk

#### DELETE /certificate/delete/all
