import axios from 'axios';

const holidayService = {
    async getHolidays(year) {
        const response = await axios.get(`/api/jours-feries/metropole/${year}.json`);
        return response.data;
    },
};

export default holidayService;