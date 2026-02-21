"use client";

import React from 'react';
import { motion } from 'framer-motion';
import FestivalHero from '../ui/FestivalHero';
import FestivalFeatures from '../ui/FestivalFeatures';
import FestivalSteps from '../ui/FestivalSteps';
import FestivalCTA from '../ui/FestivalCTA';
import styles from './festival.module.css';

export default function FestivalHomeView() {
    return (
        <div className={`${styles.fc_root} min-h-screen pt-20 overflow-hidden relative`}>
            {/* Background decorations */}
            <div className={`absolute w-[500px] h-[500px] top-0 left-[-100px] opacity-70 bg-gradient-to-r from-rose-600/20 to-rose-500/10 rounded-full blur-3xl ${styles.fc_animate_float} pointer-events-none`} />
            <div className={`absolute w-[600px] h-[600px] top-[40%] right-[-150px] opacity-50 bg-gradient-to-r from-blue-600/15 to-blue-500/10 rounded-full blur-3xl ${styles.fc_animate_float} pointer-events-none`} />
            <div className={`absolute w-[400px] h-[400px] bottom-[-50px] left-[20%] opacity-60 bg-gradient-to-r from-rose-400/20 to-orange-400/10 rounded-full blur-3xl ${styles.fc_animate_float} pointer-events-none`} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative z-10"
            >
                <FestivalHero />
                <FestivalFeatures />
                <FestivalSteps />
                <FestivalCTA />
            </motion.div>
        </div>
    );
}
