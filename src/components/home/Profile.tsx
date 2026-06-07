'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    EnvelopeIcon,
    AcademicCapIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import { MapPinIcon as MapPinSolidIcon, EnvelopeIcon as EnvelopeSolidIcon } from '@heroicons/react/24/solid';
import { Github, Linkedin, Pin } from 'lucide-react';
import { SiteConfig } from '@/lib/config';

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
}

export default function Profile({ author, social }: ProfileProps) {

    const [showAddress, setShowAddress] = useState(false);
    const [isAddressPinned, setIsAddressPinned] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [isEmailPinned, setIsEmailPinned] = useState(false);
    const [lastClickedTooltip, setLastClickedTooltip] = useState<'email' | 'address' | null>(null);

    const socialLinks = [
        ...(social.email ? [{
            name: 'Email',
            href: `mailto:${social.email}`,
            icon: EnvelopeIcon,
            isEmail: true,
        }] : []),
        ...(social.location || social.location_details ? [{
            name: 'Location',
            href: social.location_url || '#',
            icon: MapPinIcon,
            isLocation: true,
        }] : []),
        ...(social.google_scholar ? [{
            name: 'Google Scholar',
            href: social.google_scholar,
            icon: AcademicCapIcon,
        }] : []),
        ...(social.github ? [{
            name: 'GitHub',
            href: social.github,
            icon: Github,
        }] : []),
        ...(social.linkedin ? [{
            name: 'LinkedIn',
            href: social.linkedin,
            icon: Linkedin,
        }] : []),
    ];

    return (
        <div className="sticky top-8">
            {/* Profile Image */}
            <div className="w-64 h-64 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
                <Image
                    src={author.avatar}
                    alt={author.name}
                    width={256}
                    height={256}
                    className="w-full h-full object-cover object-[32%_center]"
                    priority
                />
            </div>

            {/* Name and Title */}
            <div className="text-center mb-4">
                <h1 className="text-3xl font-serif font-bold text-primary mb-2">
                    {author.name}
                </h1>
                <p className="text-lg text-accent font-medium mb-1">
                    {author.title}
                </p>
                <p className="text-neutral-600 mb-2">
                    {author.institution}
                </p>
            </div>

            {/* Signature */}
            <div className="mb-3 flex justify-center px-3">
                <Image
                    src="/signature.png"
                    alt={`${author.name} signature`}
                    width={820}
                    height={609}
                    className="h-auto w-full max-w-[130px] opacity-90"
                />
            </div>

            {/* Contact Links */}
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-6 relative px-2">
                {socialLinks.map((link) => {
                    const IconComponent = link.icon;
                    if (link.isLocation) {
                        return (
                            <div key={link.name} className="relative">
                                <button
                                    onMouseEnter={() => {
                                        if (!isAddressPinned) setShowAddress(true);
                                        setLastClickedTooltip('address');
                                    }}
                                    onMouseLeave={() => !isAddressPinned && setShowAddress(false)}
                                    onClick={() => {
                                        setIsAddressPinned(!isAddressPinned);
                                        setShowAddress(!isAddressPinned);
                                        setLastClickedTooltip('address');
                                    }}
                                    className={`p-1.5 transition-colors duration-200 ${isAddressPinned
                                        ? 'text-accent'
                                        : 'text-neutral-600 hover:text-accent'
                                        }`}
                                    aria-label={link.name}
                                    aria-expanded={showAddress || isAddressPinned}
                                >
                                    {isAddressPinned ? (
                                        <MapPinSolidIcon className="h-7 w-7" />
                                    ) : (
                                        <MapPinIcon className="h-7 w-7" />
                                    )}
                                </button>

                                {(showAddress || isAddressPinned) && (
                                    <div
                                        className={`fade-in absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-neutral-800 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none sm:whitespace-nowrap ${lastClickedTooltip === 'address' ? 'z-20' : 'z-10'
                                            }`}
                                        onMouseEnter={() => {
                                            if (!isAddressPinned) setShowAddress(true);
                                            setLastClickedTooltip('address');
                                        }}
                                        onMouseLeave={() => !isAddressPinned && setShowAddress(false)}
                                    >
                                        <div className="text-center">
                                            <div className="flex items-center justify-center space-x-2 mb-1">
                                                <p className="font-semibold">Work Address</p>
                                                {!isAddressPinned && (
                                                    <div className="flex items-center space-x-0.5 text-xs text-neutral-400 opacity-60">
                                                        <Pin className="h-2.5 w-2.5" />
                                                        <span className="hidden sm:inline">Click</span>
                                                    </div>
                                                )}
                                            </div>
                                            {social.location_details?.map((line, i) => (
                                                <p key={i} className="break-words">{line}</p>
                                            ))}
                                            <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
                                                {social.location_url && (
                                                    <a
                                                        href={social.location_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 w-full sm:w-auto"
                                                    >
                                                        <MapPinIcon className="h-4 w-4" />
                                                        <span>Google Map</span>
                                                    </a>
                                                )}
                                            </div>

                                        </div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
                                    </div>
                                )}
                            </div>
                        );
                    }
                    if (link.isEmail) {
                        return (
                            <div key={link.name} className="relative">
                                <button
                                    onMouseEnter={() => {
                                        if (!isEmailPinned) setShowEmail(true);
                                        setLastClickedTooltip('email');
                                    }}
                                    onMouseLeave={() => !isEmailPinned && setShowEmail(false)}
                                    onClick={() => {
                                        setIsEmailPinned(!isEmailPinned);
                                        setShowEmail(!isEmailPinned);
                                        setLastClickedTooltip('email');
                                    }}
                                    className={`p-1.5 transition-colors duration-200 ${isEmailPinned
                                        ? 'text-accent'
                                        : 'text-neutral-600 hover:text-accent'
                                        }`}
                                    aria-label={link.name}
                                    aria-expanded={showEmail || isEmailPinned}
                                >
                                    {isEmailPinned ? (
                                        <EnvelopeSolidIcon className="h-7 w-7" />
                                    ) : (
                                        <EnvelopeIcon className="h-7 w-7" />
                                    )}
                                </button>

                                {(showEmail || isEmailPinned) && (
                                    <div
                                        className={`fade-in absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-neutral-800 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none sm:whitespace-nowrap ${lastClickedTooltip === 'email' ? 'z-20' : 'z-10'
                                            }`}
                                        onMouseEnter={() => {
                                            if (!isEmailPinned) setShowEmail(true);
                                            setLastClickedTooltip('email');
                                        }}
                                        onMouseLeave={() => !isEmailPinned && setShowEmail(false)}
                                    >
                                        <div className="text-center">
                                            <div className="flex items-center justify-center space-x-2 mb-1">
                                                <p className="font-semibold">Email</p>
                                                {!isEmailPinned && (
                                                    <div className="flex items-center space-x-0.5 text-xs text-neutral-400 opacity-60">
                                                        <Pin className="h-2.5 w-2.5" />
                                                        <span className="hidden sm:inline">Click</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="break-words">{social.email?.replace('@', ' (at) ')}</p>
                                            <div className="mt-2">
                                                <a
                                                    href={link.href}
                                                    className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 w-full sm:w-auto"
                                                >
                                                    <EnvelopeIcon className="h-4 w-4" />
                                                    <span className="sm:hidden">Send</span>
                                                    <span className="hidden sm:inline">Send Email</span>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
                                    </div>
                                )}
                            </div>
                        );
                    }
                    return (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-neutral-600 hover:text-accent transition-colors duration-200"
                            aria-label={link.name}
                        >
                            <IconComponent className="h-7 w-7" />
                        </a>
                    );
                })}
            </div>

            {/* GitHub Statistics */}
            {social.github && (
                <div className="mb-6">
                    <a
                        href={social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:opacity-80 transition-opacity duration-200"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://raw.githubusercontent.com/ImYangC7/Repo-recorder/main/generated/overview.svg"
                            alt="GitHub Statistics"
                            width={495}
                            height={195}
                            loading="lazy"
                            decoding="async"
                            className="w-full rounded-lg"
                        />
                    </a>
                </div>
            )}

        </div>
    );
}
