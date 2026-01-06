import React, { useState } from 'react';
import "../../CSS/Modal.css"

const BillModal = ({ pdfBlob, onClose }) => {
    const [url, setUrl] = useState(null);

    React.useEffect(() => {
        if (pdfBlob) {
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setUrl(pdfUrl);
            return () => {
                URL.revokeObjectURL(pdfUrl);
            };
        }
    }, [pdfBlob]);

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                {url && (
                    <>
                        <embed
                            src={url}
                            type="application/pdf"
                            width="100%"
                            height="800px"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default BillModal;