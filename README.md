# SMART PARK — Premium Parking Management Prototype

A beginner-friendly, responsive front-end prototype built with HTML, CSS and vanilla JavaScript.

## Features
- Premium graphite, black and champagne-gold interface
- Multi-page-style navigation inside one HTML page (SPA-style sections)
- Parking area search and filters
- SmartMatch rule-based recommendation scoring
- Interactive sample parking map
- EV parking directory
- Demo booking, cancellation and digital parking pass
- User dashboard and admin overview
- Browser localStorage persistence

## Run in Visual Studio Code
1. Extract the `SMART-PARK` folder.
2. Open VS Code.
3. Select **File → Open Folder...** and choose `SMART-PARK`.
4. Open `index.html`.
5. Recommended: install the **Live Server** extension by Ritwick Dey.
6. Right-click `index.html` and choose **Open with Live Server**.
7. Your browser should open the site, usually at `http://127.0.0.1:5500`.

You can also double-click `index.html` to open it, but Live Server is recommended.

## Folder structure
```text
SMART-PARK/
├── index.html
├── README.md
├── .gitignore
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    └── images/
```

## Demo flow
1. Open Find Parking.
2. Select an available space.
3. Confirm the demo reservation.
4. View the generated digital pass.
5. Open My Bookings to cancel a reservation if needed.
6. Open Admin to see the booking and updated availability.
7. Try SmartMatch and EcoPark.

## Reset demo data
The project saves demo bookings in browser localStorage under `smartParkDemo_v1`.
To reset, open browser Developer Tools → Application → Local Storage → your local site → delete `smartParkDemo_v1`, then refresh.

## GitHub upload
1. Create a new public or private repository on GitHub named `smart-park`.
2. In VS Code, open the Source Control panel.
3. Choose **Initialize Repository**.
4. Stage the files.
5. Commit with message: `Initial Smart Park prototype`.
6. Choose **Publish Branch** and follow the GitHub sign-in prompts.

Or use Git commands from the project folder:
```bash
git init
git add .
git commit -m "Initial Smart Park prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/smart-park.git
git push -u origin main
```
Replace `YOUR-USERNAME` with your GitHub username.

## Important prototype limitations
- The data is sample data stored only in the current browser.
- localStorage is not a secure database.
- Admin preview is not protected by real authentication.
- No real-time sensors, GPS, payment gateway, charging hardware or actual QR gate scanner is connected.
- The digital pass is a demonstration confirmation, not a real parking entry permit.

For a real multi-user deployment, add a backend, database, secure authentication, server-side authorization and validated payment/parking integrations.
