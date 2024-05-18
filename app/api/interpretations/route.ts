import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

//create interpretation
async function createInterpretation(data: {term: string, interpretation: string}) {
    try {
        const response = await database.createDocument(process.env.NEXT_PUBLIC_DATABASE_ID as string, "Interpretations", ID.unique(), data);
        return response;
    } catch (error) {
        console.log(error);
        throw new Error("faile to create interpreation");
        
        
    }
}

//fetch interpretation
async function fetchInterpretation() {
    try {
        const response = await database.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID as string, "Interpretations",[Query.orderDesc("$createdAt")]);
        return response.documents;
    } catch (error) {
        console.log(error);
        throw new Error("faile to fetch interpreation");
        
        
    }
}


export async function POST(req: Request) {
    try {
        const {term, interpretation} = await req.json();
        const data = {term, interpretation};
        const response = await createInterpretation(data);
        return NextResponse.json({message: "Interpretation created"})
    } catch (error) {
        return NextResponse.json(
            {error: "failed to create interpretation"},
            {status: 500}
        )
    }
}


export async function GET() {
    try {
        const interpreation = await fetchInterpretation();
        return NextResponse.json(interpreation);
    } catch (error) {
        return NextResponse.json(
            {error: 'failed to fetch interpretations'},
            {status: 500}
        )
    }
}