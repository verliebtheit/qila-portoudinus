import type { IconName } from './icons';

export type Site = {
	brand: string;
	name: string;
	role: string;
	welcome: string;
	greeting: string;
	intro: string;
	status: string;
	interests: { label: string; icon: IconName }[];
};

export type NavItem = {
	href: string;
	label: string;
	icon: IconName;
};

export type Project = {
	title: string;
	description: string;
	label?: string;
	image?: string;
	href?: string;
};

export type About = {
	intro: string;
	background: string;
	hobbies: string;
	details: { label: string; value: string }[];
};

export type SkillGroup = {
	title: string;
	note: string;
	items: string[];
};

export type Contact = {
	invite: string;
	note: string;
	github: string;
	email: string;
};

export const site: Site = {
	brand: 'qila.exe',
	name: 'Qila',
	role: 'Student Developer',
	welcome: 'qila.exe',
	greeting: "Hi, I'm Qila!",
	intro:
		"I'm a student developer learning by building small, playful things. This is my little retro corner of the internet — a bit curious, a bit cozy, and always a work in progress.",
	status: 'online — learning in public',
	interests: [
		{ label: 'Programming', icon: 'code' },
		{ label: 'Technology', icon: 'monitor' },
		{ label: 'Game development', icon: 'gamepad' },
		{ label: 'Gaming', icon: 'play' },
		{ label: 'Photography', icon: 'camera' },
		{ label: 'Music', icon: 'music' }
	]
};

export const navItems: NavItem[] = [
	{ href: '#home', label: 'home', icon: 'home' },
	{ href: '#about', label: 'about', icon: 'user' },
	{ href: '#projects', label: 'projects', icon: 'folder' },
	{ href: '#skills', label: 'skills', icon: 'star' },
	{ href: '#contact', label: 'contact', icon: 'mail' }
];

export const projects: Project[] = [
	{
		title: 'Futsal Reservation',
		label: 'website',
		description: 'A website for reserving futsal courts.'
	},
	{
		title: 'Football Game',
		label: 'game',
		description: 'A game with a football theme.'
	},
	{
		title: 'Snaps',
		label: 'social app',
		description: 'A social media application inspired by Threads.'
	}
];

export const about: About = {
	intro:
		"I'm Qila, a student developer who likes turning curiosity into small projects I can learn from.",
	background:
		"Most of what I know comes from exploring, experimenting, and figuring things out one step at a time. I'm especially interested in programming, technology, and game development, and I enjoy making things that feel a little personal.",
	hobbies:
		"When I'm not coding or learning something new, I usually spend time gaming, taking photos, or listening to music.",
	details: [
		{ label: 'Name', value: 'Qila' },
		{ label: 'Role', value: 'Student Developer' },
		{ label: 'Personality', value: 'Creative, curious, playful, and a little quirky' },
		{ label: 'Vibe', value: 'Late 90s / early 2000s retro computer feel' }
	]
};

export const skillGroups: SkillGroup[] = [
	{
		title: 'Currently Learning',
		note: 'Things I’m actively practicing and getting more comfortable with.',
		items: ['Svelte & SvelteKit', 'TypeScript', 'Tailwind CSS']
	},
	{
		title: 'Beginner',
		note: 'The basics I’m building on, one project at a time.',
		items: ['HTML', 'CSS', 'JavaScript']
	},
	{
		title: 'Familiar With',
		note: 'Tools I can find my way around while I keep learning.',
		items: ['Git', 'Vite', 'Bun', 'VS Code']
	}
];

export const contact: Contact = {
	invite:
		'Want to say hi, share something cool, or talk about projects and ideas? I’d love to hear from you.',
	note: 'The message form below is the best way to reach me right now while other links are still being set up.',
	github: '',
	email: ''
};
