import { myAxios } from "./helper";

export const viewBill = async (orderId) => {
    try {
        const response = await myAxios.get('/bill/'+orderId, {
            responseType: 'blob', 
        });

        return new Blob([response.data], { type: 'application/pdf' }, {filename: "Bill-"+orderId});
    } catch (error) {
        console.error('Error opening the PDF file', error);
    }
};

export const downloadBill = async (orderId) => {
    try {
        const response = await myAxios.get('/bill/'+orderId, {
            responseType: 'blob',
        });

        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

        const url = window.URL.createObjectURL(pdfBlob);

        const link = document.createElement('a');
        link.href = url;

        const contentDisposition = response.headers['content-disposition'];
        let filename = 'downloadedFile.pdf';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch && filenameMatch.length === 2) {
                filename = filenameMatch[1];
            }
        }
        link.setAttribute('download', filename);
        
        document.body.appendChild(link);

        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading the PDF file', error);
    }
};