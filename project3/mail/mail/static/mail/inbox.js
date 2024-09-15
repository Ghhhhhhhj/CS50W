document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  load_emails(mailbox);
}

function send_email(event) {
  event.preventDefault();
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
      console.log(result);
      load_mailbox('sent')
  })
  .catch(error => {
      console.error('Error:', error);
  });
  ;
}

function load_emails(mailbox) {
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

      document.querySelector('#emails-view').innerHTML = '';
      console.log(emails);

      emails.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      emails.forEach(email => {

        

        const isRead = email.read;
        const isArchived = email.archived;

        if(isArchived){
          return;
        }

        const element = document.createElement('div');
        element.classList.add('email-item');

        const sender = document.createElement('strong');
        sender.textContent = email.sender;

        const subject = document.createElement('span')
        subject.textContent = email.subject

        const timestamp = document.createElement('span')
        timestamp.textContent = email.timestamp;
        timestamp.classList.add('timestamp');

        if(isRead) {
          element.style.backgroundColor='lightgray'
        }

        element.appendChild(sender);
        element.appendChild(subject);
        element.appendChild(timestamp);

        document.querySelector('#emails-view').appendChild(element)
      });
      

  });

}