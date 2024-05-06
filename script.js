document.addEventListener('DOMContentLoaded', function() {
    // Sélection des éléments DOM
    const addBtn = document.querySelector('.add');
    const submitBtn = document.querySelector('.submit');
    const close = document.querySelector('.close');
    const list = document.getElementById('task-list');
    const all = document.getElementById('day');
    const filterDateInput = document.getElementById('filter-date-input');
    const deleteAllCheckbox = document.getElementById('delete-all');
    const deleteButton = document.getElementById('delete-button');
    const sortButton = document.getElementById('sortButton');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  
// Événement du clic sur le bouton "Close"

    close.addEventListener('click', () => {
        $('#myModal').modal('hide');
    });    

    addBtn.addEventListener('click', () => {
        $('#myModal').modal('show');
    
        // Récupérer la date sélectionnée dans le champ de filtrage
        const selectedDate = filterDateInput.value;
    
        // Pré-remplir le champ de date dans le modal avec la date sélectionnée
        document.getElementById('date').value = selectedDate;
    }); 
    // Fonction pour formater une date au format jj/mm/aaaa
    // function formatDate(dateString) {
    //     const [year, month, day] = dateString.split('-');
    //     return `${day}/${month}/${year}`;
    // }

   const today = new Date().toISOString().split('T')[0];

   all.textContent = new Date(today).toLocaleDateString("fr-FR");// formatDate(selectedDate); // Affiche la date du jour

   filterDateInput.value = today ;


    // Affichage des tâches pour la date par défaut au chargement de la page
    displayTasks(today);
    
    // Initialisation des tâches

    // Affichage des tâches pour une date donnée
    function displayTasks(selectedDate) {
        list.innerHTML = ''; // Efface la liste actuelle
        tasks.forEach(task => {
            if (task.date === selectedDate) {
               
                const li = document.createElement('li');
                if (task.done) {
                    li.classList.add('done'); // Ajoute la classe "done" si la tâche est terminée
                }
                li.classList.add('task');
                const taskDetails = document.createElement('div');
                taskDetails.classList.add('task-details');
                const titleSpan = document.createElement('span');
                const titleCheckbox = document.createElement('input');
                titleCheckbox.type = 'checkbox';
                titleCheckbox.classList.add('task-checkbox');
                titleSpan.textContent = task.title;
                titleSpan.classList.add('task-title');
                const timeSpan = document.createElement('span');
                timeSpan.textContent = task.time;
                timeSpan.classList.add('task-date');
                taskDetails.appendChild(titleCheckbox);
                taskDetails.appendChild(titleSpan);
                taskDetails.appendChild(timeSpan);
                li.appendChild(taskDetails);
                list.appendChild(li);      
                
                 // Écouter le double clic sur le titre pour le modifier
            titleSpan.addEventListener('dblclick', function() {
                // Créer un champ d'entrée pour modifier le titre
                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.value = titleSpan.textContent;
                titleInput.classList.add('task-title-input');
                taskDetails.replaceChild(titleInput, titleSpan);

                // Focus sur le champ d'entrée
                titleInput.focus();

                // Écouter l'événement "keypress" pour enregistrer les modifications lorsque l'utilisateur appuie sur Entrée
                titleInput.addEventListener('keypress', function(event) {
                    if (event.key === 'Enter') {
                        updateTaskTitle(task, titleInput.value, taskDetails, titleInput);
                    }
                });

                // Écouter l'événement de perte de focus pour enregistrer les modifications
                
                titleInput.addEventListener('blur', function() {
                    updateTaskTitle(task, titleInput.value, taskDetails, titleInput);
                });
            });

            // Écouter le clic sur le titre pour le marquer comme terminé ou non terminé
            titleSpan.addEventListener('click', function() {
                toggleTaskDone(task, titleSpan);
            });
            }

        });

       
    }

    // Fonction pour mettre à jour le titre de la tâche dans la liste des tâches et dans le stockage local
    function updateTaskTitle(task, newTitle, taskDetails, titleInput) {
        task.title = newTitle;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Revenir à l'affichage en <span> avec le nouveau titre
        const newTitleSpan = document.createElement('span');
        newTitleSpan.textContent = newTitle;
        newTitleSpan.classList.add('task-title');
        taskDetails.replaceChild(newTitleSpan, titleInput);
    }

    // Marquer une tâche comme terminée ou non terminée
    function toggleTaskDone(task, taskElement) {
        task.done = !task.done;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskElement.classList.toggle('done');
    }

    // Tri des tâches par heure
    function sortTasks(order) {
        const sortedTasks = [...tasks].sort((a, b) => {
            const timeA = convertToSeconds(a.time);
            const timeB = convertToSeconds(b.time);
            return order === 'asc' ? timeA - timeB : timeB - timeA;
        });
        tasks = sortedTasks;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        const selectedDate = filterDateInput.value;
        displayTasks(selectedDate);
    }

    // Conversion de l'heure en secondes
    function convertToSeconds(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60;
    }
// Déclaration de la variable pour suivre l'ordre de tri
let sortOrder = 'asc';

// Événement du clic sur le bouton de tri
sortButton.addEventListener('click', () => {
    toggleSortOrder(); // Appel de la fonction pour basculer l'ordre de tri
});

// Fonction pour basculer l'ordre de tri et actualiser
function toggleSortOrder() {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; // Inversion de l'ordre de tri
    sortTasks(sortOrder); // Appel de la fonction pour trier les tâches
    updateButtonText(); // Mise à jour du texte du bouton
}

// Fonction pour mettre à jour le texte du bouton en fonction de l'ordre de tri actuel
function updateButtonText() {
    var buttonText = sortOrder === 'asc' ? 'Tri croissant' : 'Tri décroissant';
    sortButton.textContent = buttonText;
}

// Événement du clic sur le bouton "Ajouter tâches"
submitBtn.addEventListener('click', () => {
    const title = document.getElementById('input').value.trim();
    const date = document.getElementById('date').value.trim();
    const time = document.getElementById('time').value.trim();
    const titleError =  document.getElementById('title-error');
    const dateInvalid =  document.getElementById('date-Invalid');
    const allError = document.getElementById('formError');
    const timeError =  document.getElementById('time-error');
    const selectedDate = filterDateInput.value;

    const all = title === '' && date === '' && time === '' ;
    if (all) {
        allError.classList.add("show");
        return; // Stopper l'exécution si tous les champs sont vides
    } else {
        allError.classList.remove("show");
    }

    const Error = [titleError, timeError];
    const Donne = [title,time];
    let hasError = false;
    // Vérifier si la date est inférieure ou égale à la date du jour
    let hasErrorDate = false;


    const currentDate = new Date().toISOString().split('T')[0]; // Convertir la date du jour en format ISO
    const taskDate = new Date(date);

    if (taskDate < new Date(currentDate)) { // Comparer avec la date actuelle en tant qu'objet Date
        dateInvalid.classList.add("show");
        hasErrorDate = true;
    } else {
        dateInvalid.classList.remove("show");
    }

    if (hasErrorDate) {
        return; // Arrêter l'exécution si une erreur est détectée
    }

    // Vérifier si les champs sont vides
    for (let i = 0; i < Donne.length; i++) {
        if (Donne[i] === '') {
            Error[i].classList.add("show");
            hasError = true;
        } else {
            Error[i].classList.remove("show");
        }
    }    

    if (hasError) {
        return; // Arrêter l'exécution si une erreur est détectée
    }

    // Traitement de la soumission du formulaire si tous les champs sont valides
    tasks.push({ title, date, time, done: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks(selectedDate);
    $('#myModal').modal('hide');
    document.getElementById('input').value = '';
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';
});

// Événement du changement dans le champ de filtrage de la date
filterDateInput.addEventListener('change', () => {
    const selectedDate = filterDateInput.value;
    displayTasks(selectedDate);
});

    
    // Événement du changement dans le champ de filtrage de la date
    filterDateInput.addEventListener('change', () => {
        const selectedDate = filterDateInput.value;
        all.textContent = new Date(selectedDate).toLocaleDateString("fr-FR");// formatDate(selectedDate); // Affiche la date du jour
        displayTasks(selectedDate);
    });

    // Événement du changement dans la case à cocher "delete-all"
    deleteAllCheckbox.addEventListener('change', () => {
        const isChecked = deleteAllCheckbox.checked;
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    });
    deleteButton.addEventListener('click', () => {
        const checkedCheckboxes = document.querySelectorAll('.task-checkbox:checked');
        checkedCheckboxes.forEach(checkbox => {
            const taskElement = checkbox.closest('.task');
    
            // Obtenir l'index de la tâche à supprimer dans le tableau tasks
            const index = Array.from(taskElement.parentNode.children).indexOf(taskElement);
    
            console.log('Index à supp :', index);
            console.log('Tache à supp :', tasks[index]);
    
            // Supprimer la tâche du tableau tasks
            tasks.splice(index, 1);
    
            // Afficher le tableau tasks après la suppression
            console.log('Taches après suppression :', tasks);
    
            // Mettre à jour le stockage local avec les tâches modifiées
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            taskElement.remove();
        });
    });
    
    
    
});
