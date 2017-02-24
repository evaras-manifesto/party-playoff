app.controller('HomeScreen', class HomeScreen {
    saveUsername() {
        console.log('saveUsername', this.Settings.username);
        if (this.Settings.username) {
            localStorage.setItem('username', this.Settings.username);
        }
    }

    constructor(Settings, $element) {
        this.$element = $element;
        this.Settings = Settings;
    }

    $onInit() {
        console.log('HomeScreen', this);
        console.log(this.$element.find('.logo-text'));

        this.$element.find('.logo-text').textillate({
            loop: true,
            autoStart: true,
            minDisplayTime: 100,
            in: {
                effect: 'bounceIn',
                shuffle: true
            },
            out: {
                effect: 'bounceOut',
                shuffle: true
            },
            type: 'char'
        });

        // this.$element.find('small').textillate({
        //     loop: true,
        //     autoStart: true,
        //     minDisplayTime: 100,
        //     in: {
        //         effect: 'bounceInDown',
        //         shuffle: true
        //     },
        //     out: {
        //         effect: 'bounceOutDown',
        //         shuffle: true
        //     },
        //     type: 'char'
        // });
    }
});



