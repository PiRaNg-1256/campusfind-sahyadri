
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="border-t bg-white pt-10 pb-6 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-primary">CampusFind</h3>
                        <p className="text-sm text-gray-600">
                            The official lost and found portal for Sahyadri College of Engineering & Management.
                            Helping students and staff reunite with their belongings.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-primary">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/" className="hover:text-primary">Home</Link></li>
                            <li><Link href="/browse" className="hover:text-primary">Browse Items</Link></li>
                            <li><Link href="/items/create" className="hover:text-primary">Report an Item</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary">My Dashboard</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-primary">Contact</h3>
                        <p className="text-sm text-gray-600 mb-2">
                            Sahyadri College of Engineering & Management<br />
                            Adyar, Mangaluru - 575007
                        </p>
                        <p className="text-sm text-gray-600">
                            Email: contact@sahyadri.edu.in
                        </p>
                    </div>
                </div>
                <div className="border-t pt-6 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Sahyadri College of Engineering & Management. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
