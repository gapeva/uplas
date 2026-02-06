import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';

export default function LessonPage() {
    const { topicId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                // Backend: LessonContentView in courses/views.py
                const res = await api.get(`/courses/lessons/${topicId}/content/`);
                setLesson(res.data);
            } catch (err) {
                console.error("Error fetching lesson content", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [topicId]);

    if (loading) return <div>Loading lesson...</div>;
    if (!lesson) return <div>Content not available</div>;

    // Backend sends 'content' JSON in Topic model
    const { content } = lesson; 

    return (
        <div className="container py-10 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
            
            <div className="lesson-content bg-white p-8 rounded-xl shadow-sm border">
                {content.type === 'video' && (
                    <div className="aspect-video bg-black mb-6">
                        <iframe src={content.url} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
                    </div>
                )}
                
                {content.text_content && (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.text_content }} />
                )}

                {/* If there are quizzes attached (TopicDetailSerializer includes questions) */}
                {lesson.questions && lesson.questions.length > 0 && (
                    <div className="mt-10 border-t pt-6">
                        <h3 className="text-xl font-bold mb-4">Quiz</h3>
                        {lesson.questions.map((q, idx) => (
                            <div key={q.id} className="mb-6">
                                <p className="font-medium mb-2">{idx + 1}. {q.text}</p>
                                <div className="space-y-2">
                                    {q.choices.map(c => (
                                        <label key={c.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                            <input type="radio" name={`q-${q.id}`} />
                                            <span>{c.text}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
