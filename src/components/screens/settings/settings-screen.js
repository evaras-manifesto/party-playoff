app.controller('SettingsScreen', class SettingsScreen {
    saveUsername() {
        console.log('saveUsername', this.Settings.username);
        if (this.Settings.username) {
            localStorage.setItem('username', this.Settings.username);
        }
    }

    constructor(Settings) {
        this.Settings = Settings;
    }

    $onInit() {
        console.log(this);
    }
});



