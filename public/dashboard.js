async function fetchUsers() {
  const res = await fetch('/api/admin/users');
  return res.json();
}

function renderUsers(users) {
  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = '';
  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email || ''}</td>
      <td>${u.role || ''}</td>
      <td>${u.online ? '<strong style="color:green">online</strong>' : '<span>offline</span>'}</td>
      <td class="actions"><button data-id="${u.id}" class="delete">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function load() {
  const users = await fetchUsers();
  renderUsers(users);
}

document.getElementById('createForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const form = ev.target;
  const data = new FormData(form);
  const payload = { name: data.get('name'), email: data.get('email') };
  await fetch('/api/admin/users', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  form.reset();
  await load();
});

document.querySelector('#usersTable').addEventListener('click', async (ev) => {
  const del = ev.target.closest('.delete');
  if (!del) return;
  const id = del.dataset.id;
  await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
  await load();
});

load();
