import axios from 'axios';

const getCourseContent = async id => {
    const data = {
        moodlewsrestformat: 'json',
        wstoken: 'af547e6e35fca251a48ff4bedb7f1298',
        wsfunction: 'core_course_get_contents',
        courseid: id
    };

    return await axios
        .post(
            `https://demo-moodle.orienteed.com/webservice/rest/server.php`,
            null,
            { params: data }
        )
        .then(courseResponse => {
            return courseResponse.data;
        })
        .catch(error => console.error(error));
};

export default getCourseContent;
