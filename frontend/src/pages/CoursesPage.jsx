import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import '../../styles/ucourse.css';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses/courses/');
                setCourses(response.data); // Assuming pagination structure, might be response.data.results
            } catch (error) {
                console.error("Error fetching courses", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <div className="container">Loading courses...</div>;

    return (
        <section className="courses-container">
            <div className="container">
                <header className="courses-header">
                    <h1 className="courses__main-title">Explore Our AI Courses</h1>
                </header>

                <div className="courses-grid">
                    {courses.map(course => (
                        <article key={course.id} className="course-card">
                            <div className="course-card__image-container">
                                <img src={course.thumbnail_url || '/images/default-course.png'} alt={course.title} className="course-card__image" />
                            </div>
                            <div className="course-card__content">
                                <span className="course-card__category">{course.category}</span>
                                <h3 className="course-card__title">
                                    <Link to={`/courses/${course.slug}`}>{course.title}</Link>
                                </h3>
                                <p className="course-card__description">{course.short_description}</p>
                                <div className="course-card__footer">
                                    <span className="course-card__price">${course.price}</span>
                                    <Link to={`/courses/${course.slug}`} className="button button--secondary button--small">View Details</Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoursesPage;
