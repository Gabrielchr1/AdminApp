// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona eventos de clique aos botões de opção
    document.getElementById('option01Btn').addEventListener('click', () => {
        document.getElementById('option01Content').style.display = 'block';
        document.getElementById('option02Content').style.display = 'none';
        document.getElementById('option03Content').style.display = 'none';
        document.getElementById('option04Content').style.display = 'none';
    });

    document.getElementById('option02Btn').addEventListener('click', () => {
        document.getElementById('option01Content').style.display = 'none';
        document.getElementById('option02Content').style.display = 'block';
        document.getElementById('option03Content').style.display = 'none';
        document.getElementById('option04Content').style.display = 'none';
    });

    document.getElementById('option03Btn').addEventListener('click', () => {
        document.getElementById('option01Content').style.display = 'none';
        document.getElementById('option02Content').style.display = 'none';
        document.getElementById('option03Content').style.display = 'block';
        document.getElementById('option04Content').style.display = 'none';
    });

    document.getElementById('option04Btn').addEventListener('click', () => {
        document.getElementById('option01Content').style.display = 'none';
        document.getElementById('option02Content').style.display = 'none';
        document.getElementById('option03Content').style.display = 'none';
        document.getElementById('option04Content').style.display = 'block';
    });


    // Função de busca na tabela de usuários
    document.getElementById('searchInput').addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#userTableBody tr');

        rows.forEach(row => {
            const cells = row.getElementsByTagName('td');
            let match = false;

            for (let i = 0; i < cells.length - 1; i++) { // Excluindo a coluna de ações
                if (cells[i].textContent.toLowerCase().includes(searchTerm)) {
                    match = true;
                    break;
                }
            }

            row.style.display = match ? '' : 'none';
        });
    });

   // Ativa o modo de edição
   function enableEdit(cell) {
    if (currentCell && currentCell !== cell) {
        return; // Impede a edição de outro campo enquanto um está sendo editado
    }

    const row = cell.closest('tr');
    row.querySelectorAll('td[data-field]').forEach(c => {
        if (c !== cell) {
            c.classList.add('locked');
        }
    });

    const value = cell.textContent.trim();
    originalValue = value; // Armazena o valor original
    cell.innerHTML = `<input type="text" value="${value}">`;
    cell.querySelector('input').focus();

    currentCell = cell;
}

// Salva o campo editado
function saveField(cell) {
    const input = cell.querySelector('input');
    const value = input.value.trim();

    if (value === '') {
        alert('O campo não pode ser vazio.');
        return;
    }

    const field = cell.getAttribute('data-field');
    const row = cell.closest('tr');
    const id = row.getAttribute('data-id');

    const formData = new FormData();
    formData.append(field, value);

    fetch(`/edit/${id}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            cell.textContent = value;
            row.querySelector('.edit-btn').style.display = 'inline-block';
            row.querySelector('.save-btn').style.display = 'none';
            row.querySelector('.cancel-btn').style.display = 'none';
            row.querySelectorAll('td[data-field]').forEach(c => c.classList.remove('locked'));
            currentCell = null;
        } else {
            alert('Erro ao salvar dados.');
        }
    })
    .catch(() => alert('Erro ao salvar dados.'));
}

// Cancela a edição e restaura o valor original
function cancelEdit(cell) {
    cell.textContent = originalValue;
    const row = cell.closest('tr');
    row.querySelectorAll('td[data-field]').forEach(c => c.classList.remove('locked'));
    row.querySelector('.edit-btn').style.display = 'inline-block';
    row.querySelector('.save-btn').style.display = 'none';
    row.querySelector('.cancel-btn').style.display = 'none';
    currentCell = null;
}

document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function () {
        const row = this.closest('tr');
        row.querySelectorAll('td[data-field]').forEach(cell => {
            cell.classList.add('editable');
            cell.addEventListener('click', () => enableEdit(cell));
        });
        this.style.display = 'none';
        row.querySelector('.save-btn').style.display = 'inline-block';
        row.querySelector('.cancel-btn').style.display = 'inline-block';
    });
});

document.querySelectorAll('.save-btn').forEach(button => {
    button.addEventListener('click', function () {
        if (currentCell) {
            saveField(currentCell);
        }
    });
});

document.querySelectorAll('.cancel-btn').forEach(button => {
    button.addEventListener('click', function () {
        if (currentCell) {
            cancelEdit(currentCell);
        }
    });
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (currentCell) {
            cancelEdit(currentCell);
        }
    }
});
});
