const jobform = document.getElementById("job-form");
const joblist = document.getElementById("joblist");

jobform.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("job-title").value;
    const company = document.getElementById("company-name").value;
    const location = document.getElementById("location").value;
    const role = document.getElementById("job-role").value;

    const jobCard = document.createElement("div");
    jobCard.classList.add("job-card");

    jobCard.innerHTML = `
        <h3>${title}</h3>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Role:</strong> ${role}</p>
        <button class="delete-btn">Delete</button>
    `;

    joblist.appendChild(jobCard);

    jobCard.querySelector(".delete-btn").addEventListener("click", function() {
        jobCard.remove();
    });

    jobform.reset();
});