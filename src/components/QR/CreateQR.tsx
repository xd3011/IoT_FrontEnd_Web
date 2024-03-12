'use client'
import { Button, QRCode } from "antd";
import { useState } from "react"

const CreateQR = () => {
    const [name, setName] = useState<string>('');

    const downloadQRCode = () => {
        const canvas = document.getElementById('myqrcode')?.querySelector<HTMLCanvasElement>('canvas');
        if (canvas) {
            const url = canvas.toDataURL();
            const a = document.createElement('a');
            a.download = 'QRCode.png';
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <div>
            <h2>CreateQR</h2>
            <div id="myqrcode">
                <QRCode value={name || ''} bgColor="#fff" style={{ marginBottom: 16 }} />
                {name && <Button type="primary" onClick={downloadQRCode}>
                    Download
                </Button>}
            </div>
            <input value={name} type="text" style={{ border: '1px solid #ccc' }} onChange={e => setName(e.target.value)} />
        </div>
    )
}

export default CreateQR