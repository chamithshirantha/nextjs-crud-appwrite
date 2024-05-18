import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

//fetch a specific interpretation

async function fetchInterpretation(id: string) {
    try {
        const interpretation = await database.getDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID as string,
            "Interpretations",
            id
        );
        return interpretation;
    } catch (error) {
        console.error('Error fetching interpretation', error);
        throw new Error("failed to fetch interpretation");

    }
}

// delete a spacific interpretation

async function deleteInterpretation(id: string) {
    try {
        const response = await database.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID as string,
            "Interpretations",
            id
        )
    } catch (error) {
        console.error('Error delete interpretation', error);
        throw new Error("failed to delete interpretation");
    }
}


// update a spacific interpretation

async function updateInterpretation(id: string, data: { term: string, interpretation: string }) {
    try {
        const response = await database.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID as string,
            "Interpretations",
            id,
            data
        );
    } catch (error) {
        console.error('Error delete interpretation', error);
        throw new Error("failed to delete interpretation");
    }
}


export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const interpretation = await fetchInterpretation(id);
        return NextResponse.json({ interpretation })
    } catch (error) {
        return NextResponse.json(
            { error: "failed to fetch interpretation" },
            { status: 500 }
        )
    }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        await deleteInterpretation(id);
        return NextResponse.json({ message: 'deleted interpretation'});
    } catch (error) {
        return NextResponse.json(
            { error: "failed to delete interpretation" },
            { status: 500 }
        )
    }
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const interpretation = await req.json();
        await updateInterpretation(id, interpretation);
        return NextResponse.json({ message: 'Interpretation updated'});
    } catch (error) {
        return NextResponse.json(
            { error: "failed to updated interpretation" },
            { status: 500 }
        )
    }
}