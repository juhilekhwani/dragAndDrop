import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class NavBar extends NavigationMixin(LightningElement) {
profile;
ModerationFlag;
    
    connectedCallback(){
        if(sessionStorage.getItem('profile')=='Moderator'){
           this.ModerationFlag=true; 
        }
    }

    onCreate(){

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://ideaportal-developer-edition.ap16.force.com/s/createidea'
            }
        },
            true // Replaces the current page in your browser history with the URL
        );

    }

    handleapprovedIdeas(){

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://ideaportal-developer-edition.ap16.force.com/s/allapprovedideas'
            }
        },
            true // Replaces the current page in your browser history with the URL
        );


    }

    showIdeas(){

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://ideaportal-developer-edition.ap16.force.com/s/portal'
            }
        },
            true // Replaces the current page in your browser history with the URL
        );

    }

    handlerejectedideas(){

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://ideaportal-developer-edition.ap16.force.com/s/allrejectedideas'
            }
        },
            true // Replaces the current page in your browser history with the URL
        );


    }

    handlemytasks(){
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://ideaportal-developer-edition.ap16.force.com/s/alltasks'
            }
        },
            true // Replaces the current page in your browser history with the URL
        );


    }
    handlescoreboard(){
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://ideaportal-developer-edition.ap16.force.com/s/ideascores'
            }
        },
            true // Replaces the current page in your browser history with the URL
        );


    }

    handlevalidation(){

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://ideaportal-developer-edition.ap16.force.com/s/ideamoderation'
            }
        },
            true // Replaces the current page in your browser history with the URL
        );

    }
}