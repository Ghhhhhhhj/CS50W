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
  document.querySelector('#email-content').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-content').style.display = 'none';
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
}

function load_emails(mailbox) {
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

      console.log(emails);

      emails.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      emails.forEach(email => {

        const isRead = email.read;

        const element = document.createElement('div');
        element.classList.add('email-item');

        const sender = document.createElement('strong');
        sender.textContent = email.sender;

        const subject = document.createElement('span')
        subject.textContent = email.subject;

        const timestamp = document.createElement('span')
        timestamp.textContent = email.timestamp;
        timestamp.classList.add('timestamp');

        if(isRead) {
          element.style.backgroundColor='lightgray'
        }

        element.appendChild(sender);
        element.appendChild(subject);
        element.appendChild(timestamp);

        element.addEventListener('click', () => open_email(email.id))

        document.querySelector('#emails-view').appendChild(element)
      });
      

  });

}

function open_email(id) {
  document.querySelector('#email-content').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  document.querySelector('#email-content').innerHTML = '';

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
  
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      console.log(email);
      const isArchived = email.archived;
      const archive = document.createElement('button');

      if(isArchived){
        archive.classList.add('btn', 'btn-secondary', 'btn-sm')
        archive.innerHTML = 'Unarchive';
      } else {
        archive.classList.add('btn', 'btn-primary', 'btn-sm')
        archive.innerHTML = 'Archive';
      }

      archive.addEventListener('click', () => archive_email(email))

      const element = document.createElement('div');
      element.classList.add('email-view');

      const sender = document.createElement('div');
      sender.innerHTML = `<strong>From: </strong>${email.sender}`;

      const recipient = document.createElement('div');
      recipient.innerHTML = `<strong>To: </strong>${email.recipients[0]}`;

      const subject = document.createElement('div');
      subject.innerHTML = `<strong>Subject: </strong>${email.subject}`;
      
      const timestamp = document.createElement('div');
      timestamp.innerHTML = `<strong>Timestamp: </strong>${email.timestamp}`;

      const body = document.createElement('div');
      body.innerHTML = email.body;

      const line = document.createElement('hr');

      const replyBtn = document.createElement('button');
      replyBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      replyBtn.innerHTML = 'Reply'
      
      replyBtn.addEventListener('click', () => reply(email));

      element.appendChild(archive);
      element.appendChild(sender);
      element.appendChild(recipient);
      element.appendChild(subject);
      element.appendChild(timestamp);
      element.appendChild(replyBtn);
      element.appendChild(line);
      element.appendChild(body);

      document.querySelector('#email-content').appendChild(element);
  });

}

function archive_email(email) {
  const isArchived = email.archived;
  if(isArchived){
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })
  } else {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
  }
}

function reply(email) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-content').style.display = 'none';

  document.querySelector('#compose-recipients').value = email.sender;
  document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: 
  ${email.body}`;
}