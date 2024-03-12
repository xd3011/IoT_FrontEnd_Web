import CreateQR from "@/components/QR/CreateQR"
import ReadQR from "@/components/QR/ReadQR"

const page = () => {
    return (
        <div>
            <h1>QR Code</h1>
            <div>
                <CreateQR />
                <ReadQR />
            </div>
        </div>
    )
}

export default page