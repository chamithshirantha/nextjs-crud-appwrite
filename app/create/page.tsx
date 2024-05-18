'use client'
 
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, use, useState } from 'react'

export default function CreatePage() {
    const [formData, setFormData] = useState({term: "", interpretation: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((preData) => (
            {
                ...preData,
                [e.target.name] : e.target.value,
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
            const response = await fetch('/api/interpretations/', {
                method: "POST",
                headers: {
                    "Content-type" : "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('failed to created interpretation');
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
        <h2 className='text-2xl font-bold my-8'>Add New Interpretation</h2>
        <form onSubmit={handleSubmit} className='flex gap-3 flex-col'>
            <input type="text" name='term' value={formData.term} placeholder='Term' className='py-1 px-4 border rounded-md' onChange={handleInputChange}/>

            <textarea name="interpretation" onChange={handleInputChange} value={formData.interpretation} rows={4} placeholder='Interpretation' className='py-1 px-4 border rounded-md resize-none'></textarea>

            <button className='bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer' type='submit' disabled={isLoading}>
                {isLoading ? "Adding" : "Add Interpretation"}
            </button>
        </form>
        {error && <p className='text-red-500 mt-4'>{error}</p>}
    </div>
  )
}