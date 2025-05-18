$(window).on("load", function () {
    const $form = $("#new-task-form");
    const $input = $("#new-task-input");
    const $listElement = $("#tasks");

    // Sayfa yüklendiğinde görevleri getir
    loadTasks();

    $form.on("submit", function (e) {
        e.preventDefault();
        const taskText = $input.val().trim();
        if (taskText) {
            addTask(taskText);
            $input.val("");
            saveTasks();
        }
    });

    //GÖREV EKLEME FONKSİYONU
    function addTask(taskText, isCompleted = false) {
        const $taskElement = $("<div>").addClass("task");
        const $taskContent = $("<div>").addClass("content");

        const $checkbox = $("<input>")
            .attr("type", "checkbox")
            .addClass("task-check");

        if (isCompleted) {
            $checkbox.prop("checked", true);
            $taskElement.addClass("completed");
        }

        const $taskInput = $("<input>")
            .addClass("text")
            .attr("type", "text")
            .val(taskText)
            .attr("readonly", "readonly");

        $taskContent.append($checkbox, $taskInput);

        const $taskActions = $("<div>").addClass("actions");
        const $taskEdit = $("<i>").addClass("fa-solid fa-pencil");
        const $taskDelete = $("<i>").addClass("fa-solid fa-trash");

        $taskActions.append($taskEdit, $taskDelete);
        $taskElement.append($taskContent, $taskActions);
        $listElement.append($taskElement);

        $checkbox.on("change", function () {
    $taskElement.toggleClass("completed");

    if ($checkbox.is(":checked")) {
        $listElement.append($taskElement); // en alta taşı
    } else {
        $listElement.prepend($taskElement); // tekrar üste taşı
    }

    saveTasks(); // güncelle
});


        // Düzenleme
        $taskEdit.on("click", function () {
            if ($(this).hasClass("fa-pencil")) {
                $(this).removeClass("fa-pencil").addClass("fa-floppy-disk");
                $taskInput.removeAttr("readonly").focus();
            } else {
                $(this).removeClass("fa-floppy-disk").addClass("fa-pencil");
                $taskInput.attr("readonly", "readonly");
                saveTasks();
            }
        });

        // ✅ Silme
        $taskDelete.on("click", function () {
            $taskElement.remove();
            saveTasks();
        });
    }

    // VERİLERİ KAYDET
    function saveTasks() {
        const tasks = [];
        $(".task").each(function () {
            const text = $(this).find("input.text").val();
            const isCompleted = $(this).find(".task-check").is(":checked");
            tasks.push({ text, completed: isCompleted });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    // Bootstrap modalı ile silme onayı
$taskDelete.on("click", function() {
  $("#confirmDeleteModal").modal("show").off("click", "#confirmDeleteBtn").on("click", "#confirmDeleteBtn", function() {
    $taskElement.remove();
    saveTasks();
  });
});
// Enter tuşu desteği ekleme 
$("#new-task-input").on("keypress", function(e) {
    if (e.which === 13) { 
        e.preventDefault(); 
        $("#new-task-form").trigger("submit"); 
    }
});

    // VERİLERİ GERİ YÜKLE
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTask(task.text, task.completed));
    }
});
