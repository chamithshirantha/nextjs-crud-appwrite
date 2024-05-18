"use client"
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react'

export default function EditPage({ params }: { params: { id: string } }) {
    const [formData, setFormData] = useState({ term: "", interpretation: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/interpretations/${params.id}`);
                if (!response.ok) {
                    throw new Error("failed to fetch interpretation");
                }
                const data = await response.json();
                console.log(data);

                setFormData({ term: data.interpretation.term, interpretation: data.interpretation.interpretation })
            } catch (error) {
                setError("failed to load interpretation !")
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((preData) => (
            {
                ...preData,
                [e.target.name]: e.target.value,
            }
        ))
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.term || !formData.interpretation) {
            setError("Please fill in all the field");
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            const response = await fetch(`/api/interpretations/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('failed to update interpretation');
            }
            router.push('/');
        } catch (error) {
            console.log(error);
            setError("something went wrong. please try again")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <h2 className='text-2xl font-bold my-8'>Edit Interpretation</h2>
            <form className='flex gap-3 flex-col' onSubmit={handleSubmit}>

                <input type="text" name='term' value={formData.term} onChange={handleInputChange} placeholder='Term' className='py-1 px-4 border rounded-md' />

                <textarea name="interpretation" value={formData.interpretation} onChange={handleInputChange} rows={4} placeholder='Interpretation' className='py-1 px-4 border rounded-md resize-none'></textarea>

                <button type='submit' className='bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer'>{isLoading ? "Updating" : "update Interpretation"}</button>
            </form>
            {error && <p className='text-red-500 mt-4'>{error}</p>}

        </div>
    )
}