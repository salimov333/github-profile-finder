//GitHub APIs: https://api.github.com/

//API URL
const mainUsers_url = "https://api.github.com/users";

//Elements selecting
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const profileContainer = document.getElementById('profileContainer');
const followerContainer = document.getElementById('followerContainer');
const errorContainer = document.getElementById('error');
const followersBtn = document.getElementById("followersBtn");
const followersListContainer = document.getElementById("followersListContainer");



//Listening
//After loading Page
window.addEventListener("load", init);

//submit Form
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = searchInput.value.trim();
    const user_url = `${mainUsers_url}/${username}`
    if (username === '') {
        showError('Please enter a GitHub username.');
        return;
    }

    fetchProfile(user_url)
        .then(displayProfile)
        .catch(error => showError(`Error: ${error.message}`));
    searchInput.value = '';
});

//click followers button
followersBtn.addEventListener("click", () => {
    const username = localStorage.getItem("profileUsername");
    // console.log(username);
    if (!username) {
        alert("There is no stored profile!");
    }
    const followers_url = `${mainUsers_url}/${username}/followers`;
    fetchProfile(followers_url)
        .then((followersArr) => displayBtnGroup(followersArr, followersListContainer))
        .catch(error => showError(`Error: ${error.message}`));
});


//Fetch data
function fetchProfile(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found.');
            }
            return response.json();
        })
};


//Render elements
//init
function init() {
    const storedProfile = JSON.parse(localStorage.getItem("profile"));
    if (storedProfile) displayProfile(storedProfile);
};

function displayProfile(profile) {
    profileContainer.style.display = "block"
    const { avatar_url, name, login, bio, html_url } = profile;
    // console.log(profile);

    const newProfile = {
        avatar_url: avatar_url,
        name: name,
        login: login,
        bio: bio,
        html_url: html_url
    };

    if (name) {
        //update local storage 
        localStorage.setItem("profileUsername", login);
        localStorage.setItem("profile", JSON.stringify({ ...newProfile }));
    }

    followersBtn.classList.replace("d-none", "d-block")

    profileContainer.innerHTML = '';
    errorContainer.textContent = '';

    const profileImage = document.createElement('img');
    profileImage.src = avatar_url;
    profileImage.alt = 'Profile Picture';
    profileImage.classList.add('rounded-circle', 'img-fluid', 'boxShadow', 'w-50');
    profileContainer.appendChild(profileImage);

    const profileName = document.createElement('div');
    profileName.textContent = name;
    profileName.classList.add('mt-3', 'h4');
    profileContainer.appendChild(profileName);

    const profileUsername = document.createElement('div');
    profileUsername.textContent = `@${login}`;
    profileUsername.classList.add('h6', 'text-muted');
    profileContainer.appendChild(profileUsername);

    const profileBio = document.createElement('div');
    profileBio.textContent = bio;
    profileBio.classList.add('mt-3', 'word-wrap');
    profileContainer.appendChild(profileBio);


    const profileLink = document.createElement('a');
    profileLink.href = html_url;
    profileLink.textContent = 'View Profile on GitHub';
    profileLink.target = '_blank';
    profileLink.classList.add('mt-3', 'btn', 'btn-link');
    profileContainer.appendChild(profileLink);
};

function displayBtnGroup(arr, container) {
    const btnGroup = document.createElement("div");
    btnGroup.classList.add('d-flex', 'flex-wrap', 'gap-1', 'justify-content-center');

    arr.forEach((obj) => {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-outline-success', 'flex-grow-1');
        btn.type = "button"
        btn.innerText = obj.login;
        btn.addEventListener('click', () => {
            displayProfile(obj)
        });
        btnGroup.appendChild(btn);

    });
    container.innerHTML = "";
    container.appendChild(btnGroup);
}

//Handle Errors
function showError(message) {
    profileContainer.innerHTML = '';
    profileContainer.style.display = 'none';
    followersListContainer.innerHTML = ''
    followersBtn.classList.replace("d-block", "d-none");
    errorContainer.textContent = message;
}


//Testing
// fetchProfile(`${mainUsers_url}/salimov333`).then(user => console.log(user));
// fetchProfile(`${mainUsers_url}/salimov333/followers`).then(user => console.log(user));
