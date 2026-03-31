import { Button } from './ui/button';
import { Building2, List, LogOut } from 'lucide-react';

export default function Header({ navigate, userEmail, onLogout }) {
	return (
		<nav className="bg-primary shadow-lg border-b border-primary/20">
			<div className="max-w-7xl mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
						<div className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
							<Building2 className="h-6 w-6 text-primary-foreground" />
						</div>
						<div>
							<h1 className="text-lg font-bold text-primary-foreground">
								Voice-First Rapportage
							</h1>
							<p className="text-xs text-primary-foreground/70">
								Zorg Management Systeem
							</p>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<Button
							variant="secondary"
							size="sm"
							onClick={() => navigate('/overzicht')}
							className="hidden sm:flex"
						>
							<List className="h-4 w-4 mr-2" />
							Overzicht
						</Button>

						<div className="text-right hidden sm:block">
							<p className="text-sm font-semibold text-primary-foreground">
								{userEmail}
							</p>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={onLogout}
							className="text-primary-foreground hover:bg-primary-foreground/10"
						>
							<LogOut className="h-4 w-4 mr-2" />
							Uitloggen
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
}
