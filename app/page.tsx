"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface IInterpretations {
  $id: string;
  term: string;
  interpretation: string;
}

export default function Home() {
  const [interpretations, setInterpretations] = useState<IInterpretations[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterpretations = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/interpretations');
        if (!response.ok) {
          throw new Error("failed to fetch interpretations");
        }
        const data = await response.json();
        setInterpretations(data)
        setIsLoading(false)
      } catch (error) {
        console.log("Error: ", error);
        setError("failed to load interpretation.please reload")
        setIsLoading(false);
      }
    }
    fetchInterpretations();
  }, []);

  const handleDelete = async(id: string) => {
    try {
      await fetch(`/api/interpretations/${id}`, {method: "DELETE"});
      setInterpretations((prevInterpretations) => prevInterpretations?.filter((i) => i.$id !== id))
    } catch (error) {
      setError("failed to delete interpretation")
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {error && <p className="py-4 text-red-500">{error}</p>}

      {isLoading ? (<p>Loading interpretation....</p>
      ) : interpretations?.length > 0 ? (
        <div>
          {
            interpretations?.map(interpretation => (
              <div key={interpretation.$id} className="p-4 my-2 rounded-md border-b leading-8">
                <div className="font-bold">{interpretation.term}</div>
                <div>
                 {interpretation.interpretation}
                </div>
                <div className="flex gap-5 justify-end">
                  <Link className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest" href={`/edit/${interpretation.$id}`}>Edit</Link>
                  <button onClick={() => handleDelete(interpretation.$id)} className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest">
                    Delete
                  </button>
                </div>
              </div>
            ))
          }

        </div>
      ) : (<p>No interpretations found</p>)}
    </div>
  );
}
