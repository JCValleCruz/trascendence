import React, { useState } from 'react';
import { Box } from '@mui/material';
import GamePanel from '../components/GamePanel';
import ScoreModal from '../components/ScoreModal';
import PongGame from '../components/PongGame';

const GamesPage: React.FC = () => {
    const [leftActive, setLeftActive] = useState(false);
    const [rightActive, setRightActive] = useState(false);

	const [modalOpen, setModalOpen] = useState(false);
    const [selectedMode, setSelectedMode] = useState<'pvp' | 'ai' | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [scoreToWin, setScoreToWin] = useState(5);
	
	const handlePongSelection = (option: string) => {
		const modeStr = option.trim().toUpperCase();
        let mode: 'pvp' | 'ai' | null = null;
        if (modeStr === 'IA')
			mode = 'ai';
        else if (modeStr === '1V1')
			mode = 'pvp';

        if (mode) {
			setSelectedMode(mode);
            setModalOpen(true);
        }
    };

    const handleStartGame = (score: number) => {
		if (selectedMode) {
			setScoreToWin(score);
			setModalOpen(false);
            setIsPlaying(true);
        } 
    };

	const handleExitGame = () => {
        setIsPlaying(false);
    };

	if (isPlaying && selectedMode) {
        return (
            <Box sx={{ width: '100%', height: '100vh', bgcolor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PongGame 
                    mode={selectedMode} 
                    scoreToWin={scoreToWin} 
                    onExit={handleExitGame} 
                />
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, bgcolor: 'common.black' }}>
            
			<ScoreModal 
                open={modalOpen} 
                mode={selectedMode} 
                onClose={() => setModalOpen(false)} 
                onStart={handleStartGame} 
            />

			<GamePanel
                title="PONG"
                highlightWord="CLASSIC"
                subtitle="The original arcade legend. Pure reflex gaming."
                buttons={['IA ', 'Tournament', '1v1',]}
                align="left"
                isActive={leftActive}
                isPeerActive={rightActive}
                onHover={() => setLeftActive(true)}
                onLeave={() => setLeftActive(false)}
				onOptionSelect={handlePongSelection}
            />

            <GamePanel
                title="BLOCK"
                highlightWord="BREAKER"
                subtitle="Break through the chaos. Precision meets destruction."
                buttons={['IA ', 'Tournament', '1v1',]}
                align="right"
                isActive={rightActive}
                isPeerActive={leftActive}
                onHover={() => setRightActive(true)}
                onLeave={() => setRightActive(false)}
				//onOptionSelect={handlePongSelection}
            />
        </Box>
    );
};

export default GamesPage;
