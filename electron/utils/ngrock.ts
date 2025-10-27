import ngrok from 'ngrok';


export async function startNgrock(port: number, authToken: string) {
    if (!authToken) return;

    try {
        await ngrok.authtoken(authToken);
        const url = await ngrok.connect({ addr: port })
        return url;
    }
    catch(e) {
        console.error('❌ ngrock start failed', e);
    }
}