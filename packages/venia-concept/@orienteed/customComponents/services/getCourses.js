import axios from 'axios';

const getCourses = async () => {
    const params = {
        moodlewsrestformat: 'json',
        wstoken: 'af547e6e35fca251a48ff4bedb7f1298',
        wsfunction: 'core_course_get_courses_by_field'
    };

    return await axios
        .get(`https://34.246.201.179:8443/webservice/rest/server.php`, {
            params: params
        })
        .then(coursesResponse => {
            return coursesResponse.data;
        })
        .catch(error => console.error(error));
};

export default getCourses;
