# Thunderbird-Redirect-Me
# Thunderbird-extension
## We can use this extension to send/ redirect mails 
### we need to provide all details in json format and the mail will be sent w.r.t the json data.

e.g
## in the subject of parent mail which trigger this event should match the keyword 'json redirect'
    {
      "to":"email@email.com,email2@email.com",
      "cc":"cc@email.com,email2@email.com"
      "bcc":"bcc@email.com"
      "subject":"subject of mail",
      "body":"body in plain text or <b> in html format</b>"
    }

## Note: orignal mail subject should match 'json redirect'
# Thank You
