template:{
id
name
description
created at
updated at
owner id
user ids (users with access)
number of certificates created
canvas:{
height
width
export as
items:[
item1 :{x, y, height, width, color, ... ...}
item2
]
}
image storage reference
}

certificate:{
id
recipient
instituition
isValid (is date before validity and after issuance)
created by (uid)
issued by (uid)
created at
issued at
updated at
valid till
template id
fields :[
{
name: ...
value: ...
}
...
...
...
]
revoked at
}

user {
id
name
instituition
email
phone?
issued certificates
created certificates
created templates
is email cerified
created at
updated at
photo storage reference

}

recipient{
id
name
email
roll id
phone
custom fields{
...
...
...
}
}

recipient group{
id
name
recipients[]
created by
created at
institution
templates []
}

institution{
id
name
created by
admins []
issuers []
moderators []
viewers []
subsription id
}

subscription{
id
plan id
institution
number of certificates remaining
number of certificates issued in current subscription
isDue
due date
created at
validity
topups[]
isActive
}

///////// separate
end user{
id
name
recipient ids - [] (can verify using emails)
certificates - []
created at
updated at
}

user signs up -> user + institution info

create template
adds admins/editors
chooses from existing templates

adds recipients
enters fields for each recipient (like roll number, department, dob etc)
import from csv
manual

extract csv template for a template for users to create bulk certificates
extract
upload filled certificate
review
create

create groups
choose recipients manually
choose recipients by filter
choose recipients by csv
add group based fields (like cgpa or DOB or rank etc)
create
edit
review

pays for subscription -> gets access to create certs

create certificates for groups
choose template
choose group
get csv-template or enter details manually
(map fields in template to fields in recipients)

issue certs
review created certs
issue at a scheduled time
notify recipients by mail
