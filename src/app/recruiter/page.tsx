'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/axios';

interface Job {
    id: number;
    title: string;
    company: string;
    salary: number;
}

export default function Page() {
    const [postedJobs, setPostedJobs] = useState<Job[]>([]);

    useEffect(() => {
        const fetchPostedJobs = async () => {
            try {
                const response = await api.get<Job[]>('https://job-portal-backend-1-yib6.onrender.com/job');

                setPostedJobs(response.data);
            } catch (error) {
                console.error('Error fetching posted jobs:', error);
            }
        };

        fetchPostedJobs();
    }, []);

    console.log(postedJobs.length);

    return (
        <div>
            <h1>Recruiter Dashboard</h1>

            {postedJobs.map((job) => (
                <div key={job.id}>
                    <h2>Title: {job.title}</h2>
                    <p>Company: {job.company}</p>
                    <p>Salary: {job.salary}</p>
                </div>
            ))}
        </div>
    );
}