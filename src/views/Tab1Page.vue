<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Est-ce que c'est férié aujourd'hui ?</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Est-ce que c'est férié aujourd'hui ?</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <div v-if="isLoading">Chargement en cours...</div>
                        <div v-else>
                            <div v-if="isTodayHoliday">Aujourd'hui est férié : {{ todayHolidayName }}</div>
                            <div v-else>Aujourd'hui n'est pas un jour férié.</div>
                            <div>Prochain jour férié : {{ nextHolidayName }} (dans {{ daysUntilNextHoliday }} jours)</div>
                        </div>
                        <ion-button @click="showAllHolidays = !showAllHolidays">
                            {{ showAllHolidays ? "Masquer" : "Afficher" }} tous les jours fériés
                        </ion-button>
                        <ul v-if="showAllHolidays">
                            <li v-for="(date, name) in holidays" :key="name">
                                {{ name }} : {{ date }}
                            </li>
                        </ul>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script setup >
import { ref } from "vue";
import holidayService from "../services/holidayService";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonGrid, IonRow, IonCol } from "@ionic/vue";

const isLoading = ref(true);
const isTodayHoliday = ref(false);
const todayHolidayName = ref("");
const nextHolidayName = ref("");
const daysUntilNextHoliday = ref(0);
const showAllHolidays = ref(false);
const holidays = ref({});

const loadHolidays = async () => {
    const year = new Date().getFullYear();
    const response = await holidayService.getHolidays(year);
    holidays.value = response;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let nextHoliday = null;

    for (const [name, date] of Object.entries(holidays.value)) {
        const holidayDate = new Date(date);
        if (holidayDate.getTime() === today.getTime()) {
            isTodayHoliday.value = true;
            todayHolidayName.value = name;
        }
        if (!nextHoliday || (holidayDate > today && holidayDate < nextHoliday)) {
            nextHoliday = holidayDate;
            nextHolidayName.value = name;
        }
    }

    if (nextHoliday) {
        daysUntilNextHoliday.value = Math.floor((nextHoliday - today) / (1000 * 60 * 60 * 24));
    }

    isLoading.value = false;
};

loadHolidays();

</script>
