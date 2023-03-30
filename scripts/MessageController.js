class MessageController {

    constructor () {
        this.messages = {
            'error': 'Oops! Something went wrong',
            'no_name': 'Toch liever anoniem blijven? Klik op de checkbox onderaan het formulier',
            'no_username': 'Username ideetjes: TimeWaster3000, SillyGoose, TwinkleToes, Stinky',
            'no_email': 'Um hehe... We hebben toch echt je e-mail nodig',
            'no_studentnumber': 'Ben je stiekem geen student? Of ben je gewoon je studentnummer vergeten?',
            'invalid_email': 'Helaas pindakaas! Je e-mail komt niet voor in onze database',
            'invalid_username': 'Creatief idee! Wel een beetje kort... Verzin iets met minimaal 4 letters',
            'invalid_studentnumber': 'Hmm... Je studentnummer moet met een 5 of 6 beginnen en bestaat in totaal uit 8 cijfers'
        }
    }

    getMessage(key) {
        return this.messages[key];
    }

}

export default MessageController;