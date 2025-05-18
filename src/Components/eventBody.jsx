import * as React from 'react';
import { SingleAction } from './singleAction';
import { Droppable } from 'react-beautiful-dnd';
import { Box, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {Sprites} from './spriteProps';
import Positions from './positons';
import Resize from './resize';
import Draggable1 from 'react-draggable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { WARN_MSG_POS, WARN_MSG_SIZE } from '../constants';
import { useEffect, useRef } from 'react';
import { CategorySidebar } from './CategorySidebar';
import { BackdropMenu } from './BackdropMenu';

export const EventBody = (props) => {
    const {
        moves,
        setMoves,
        actions,
        setActions,
        setActions2, 
        actions2
    } = props;

    const ref = React.useRef();
    const ref2 = React.useRef();
    const movesContainerRef = useRef(null);
    const [activeCategory, setActiveCategory] = React.useState('Motion');
    const [isColliding, setIsColliding] = React.useState(false);
    const [hasSwappedAnimations, setHasSwappedAnimations] = React.useState(false);

    /// r, t values corresspond to right , top values  
    let r = '0%';
    let t = '0%';
    let scale = 1;
    let angle = 0;
    let r2 = '0%';
    let t2 = '0%';
    let scale2 = 1;
    let angle2 = 0;

    const [hello, setHello] = React.useState(false);
    const [hello2, setHello2] = React.useState(false);
    const [think, setThink] = React.useState(false);
    const [think2, setThink2] = React.useState(false);
    const [theme, setTheme] = React.useState(false);
    const [customBackground, setCustomBackground] = React.useState('');
    const [displayAddIcon, setDisplayAddIcon] = React.useState(true);
    const [sprite, setSprite]= React.useState(require('../Assets/images/oggy.png'));
    const [sprite2, setSprite2]= React.useState(null);
    const [activeSprite, setActiveSprite] = React.useState(1); // 1 for first sprite, 2 for second sprite
    const [currentAction, setCurrentAction] = React.useState('');

    const [isAnimating, setIsAnimating] = React.useState(false);
    const timeoutRefs = React.useRef(new Set());

    const fileInputRef = React.useRef(null);

    // Add new states for cloned sprites
    const [clonedSprites, setClonedSprites] = React.useState([]);
    const clonedRefsMap = React.useRef(new Map());
    const [clonedActions, setClonedActions] = React.useState([]);
    const [isCloneEdited, setIsCloneEdited] = React.useState({});

    console.log("rendering...");

    useEffect(() => {
        const container = movesContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const categories = container.getElementsByClassName('moves__category');
            const containerTop = container.scrollTop;
            const containerHeight = container.clientHeight;

            // Find which category is most visible
            let maxVisibleHeight = 0;
            let mostVisibleCategory = 'Motion';

            Array.from(categories).forEach((category) => {
                const rect = category.getBoundingClientRect();
                const categoryTop = rect.top;
                const categoryBottom = rect.bottom;
                const visibleHeight = Math.min(categoryBottom, containerHeight) - Math.max(categoryTop, 0);

                if (visibleHeight > maxVisibleHeight) {
                    maxVisibleHeight = visibleHeight;
                    mostVisibleCategory = category.getAttribute('data-category');
                }
            });

            setActiveCategory(mostVisibleCategory);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const clearAllTimeouts = () => {
        timeoutRefs.current.forEach(id => clearTimeout(id));
        timeoutRefs.current.clear();
    };

    const safeSetTimeout = (fn, delay) => {
        const id = setTimeout(() => {
            fn();
            timeoutRefs.current.delete(id);
        }, delay);
        timeoutRefs.current.add(id);
        return id;
    };

    // Add function to animate cloned sprites
    const animateClonedSprite = (cloneId, property, value) => {
        const cloneEl = clonedRefsMap.current.get(cloneId);
        const clone = clonedSprites.find(c => c.id === cloneId);
        
        if (!cloneEl || !clone) return;
        
        // Update the clone's properties based on the animation
        const updatedClone = { ...clone };
        
        if (property === 'x') {
            updatedClone.x = value;
        } else if (property === 'y') {
            updatedClone.y = value;
        } else if (property === 'scale') {
            updatedClone.scale = value;
        } else if (property === 'angle') {
            updatedClone.angle = value;
        }
        
        // Apply the transform
        cloneEl.style.transform = `scale(${updatedClone.scale}) translate(${updatedClone.x}%, ${updatedClone.y}%) rotate(${updatedClone.angle}deg)`;
        
        // Update the clone in state
        setClonedSprites(prevClones => 
            prevClones.map(c => c.id === cloneId ? updatedClone : c)
        );
    };

    function transform(temp, xAxis, action1, cloneId = null){
        if (!isAnimating) return; // Don't transform if not animating

        let value = temp.toString();
        
        if (cloneId) {
            // Handle clone transforms
            const clone = clonedSprites.find(c => c.id === cloneId);
            if (!clone) return;
            
            if (xAxis) {
                animateClonedSprite(cloneId, 'x', temp);
            } else {
                animateClonedSprite(cloneId, 'y', temp);
            }
            return;
        }
        
        if(xAxis){
            if(action1){
                r = value.concat('%')
            } else{
                r2 = value.concat('%')
            }
        } else{
            if(action1){
                t = value.concat('%')
            } else{
                t2 = value.concat('%')
            }
        }
        if (action1 && ref.current) {
            ref.current.style.transform = `scale(${scale})translate(${r}, ${t}) rotate(${angle}deg)`;
        } else if (!action1 && ref2.current) {
            ref2.current.style.transform = `scale(${scale2})translate(${r2}, ${t2}) rotate(${angle2}deg)`;
        }
    }

    function moveUp (i, action1, cloneId = null) {
        //move up top - 50
        safeSetTimeout(() => {
            if (cloneId) {
                const clone = clonedSprites.find(c => c.id === cloneId);
                if (!clone) return;
                
                let temp = clone.y - 50;
                if(temp < -140){
                    refresh(WARN_MSG_POS);
                    return;
                }
                animateClonedSprite(cloneId, 'y', temp);
                return;
            }
            
            let temp = parseInt(action1 ? t.slice(0,-1) : t2.slice(0,-1));
            temp = temp - 50;
            if(temp < -140){
                refresh(WARN_MSG_POS);
                return;
            }
            transform(temp, false, action1);
        }, i * 1500);
    }
    function moveDown (i, action1, cloneId = null) {  
        //move down top + 50    
        safeSetTimeout(() => {
            if (cloneId) {
                const clone = clonedSprites.find(c => c.id === cloneId);
                if (!clone) return;
                
                let temp = clone.y + 50;
                if(temp > 140){
                    refresh(WARN_MSG_POS);
                    return;
                }
                animateClonedSprite(cloneId, 'y', temp);
                return;
            }
            
            let temp = parseInt(action1 ? t.slice(0,-1) : t2.slice(0,-1));
            temp = temp + 50;
            if(temp > 140){
                refresh(WARN_MSG_POS);
                return;
            }
            transform(temp, false, action1);
        }, i * 1500);
    }
    function moveRight (i, action1, cloneId = null) {
        //move right right+50
        safeSetTimeout(() => {
            if (cloneId) {
                const clone = clonedSprites.find(c => c.id === cloneId);
                if (!clone) return;
                
                let temp = clone.x + 50;
                if(temp > 290){
                    refresh(WARN_MSG_POS);
                    return;
                }
                animateClonedSprite(cloneId, 'x', temp);
                return;
            }
            
            let temp = parseInt(action1 ? r.slice(0,-1) : r2.slice(0,-1));
            temp = temp + 50;
            if(temp > 290){
                refresh(WARN_MSG_POS);
                return;
            }
            transform(temp, true, action1);
        }, i * 1500);
    }
    function moveLeft(i, action1, cloneId = null) {
        //move right right-50 
        safeSetTimeout(() => {
            if (cloneId) {
                const clone = clonedSprites.find(c => c.id === cloneId);
                if (!clone) return;
                
                let temp = clone.x - 50;
                if(temp < -290){
                    refresh(WARN_MSG_POS);
                    return;
                }
                animateClonedSprite(cloneId, 'x', temp);
                return;
            }
            
            let temp = parseInt(action1 ? r.slice(0,-1) : r2.slice(0,-1));
            temp = temp - 50;
            if(temp < -290){
                refresh(WARN_MSG_POS);
                return;
            }
            transform(temp, true, action1);
        }, i * 1500);
    }
    function sayHello(i, action1){
        setCurrentAction('Say Hello for 5 sec');
        safeSetTimeout(() => {
            action1 ? setHello(true) : setHello2(true);
        }, i * 1500);
        
        //close hello after 5 sec
        safeSetTimeout(() => {
            if (currentAction === 'Say Hello for 5 sec') {
                action1? setHello(false):setHello2(false);
                setCurrentAction('');
            }
        }, (i * 1500) + 5000);
    }

    function thinkHmmm(i, action1){
        safeSetTimeout(() => {
            setCurrentAction('Think Hmmm for 3 sec');
            action1 ? setThink(true) : setThink2(true);
        }, i * 1500);
        
        //close think after 3 sec
        safeSetTimeout(() => {
            if (currentAction === 'Think Hmmm for 3 sec') {
                action1? setThink(false):setThink2(false);
                setCurrentAction('');
            }
        }, (i * 1500) + 3000);
    }

    function sayBye(i, action1){
        safeSetTimeout(()=>{
            setCurrentAction('Say Bye');
            // Clear any existing messages first
            setHello(false);
            setHello2(false);
            
            // Show message based on collision state
            if (hasSwappedAnimations) {
                // After collision, messages are swapped
                action1 ? setHello2(true) : setHello(true);
            } else {
                // Before collision, normal behavior
            action1 ? setHello(true) : setHello2(true);
            }
        }, (i* 1500));
        
        // Clear message after display
        safeSetTimeout(()=>{
            if (currentAction === 'Say Bye') {
                setHello(false);
                setHello2(false);
                setCurrentAction('');
            }
        }, (i*1500) + 100); // Small delay to ensure message shows
    }

    function sayHii(i, action1){
        safeSetTimeout(()=>{
            setCurrentAction('Say Hii');
            // Clear any existing messages first
            setHello(false);
            setHello2(false);
            
            // Show message based on collision state
            if (hasSwappedAnimations) {
                // After collision, messages are swapped
                action1 ? setHello2(true) : setHello(true);
            } else {
                // Before collision, normal behavior
            action1 ? setHello(true) : setHello2(true);
            }
        }, (i* 1500));
        
        // Clear message after display
        safeSetTimeout(()=>{
            if (currentAction === 'Say Hii') {
                setHello(false);
                setHello2(false);
                setCurrentAction('');
            }
        }, (i*1500) + 100); // Small delay to ensure message shows
    }

    function thinkSeeYou(i, action1){
        safeSetTimeout(()=>{
            setCurrentAction('Think See you');
            // Clear any existing messages first
            setThink(false);
            setThink2(false);
            
            // Show message based on collision state
            if (hasSwappedAnimations) {
                // After collision, messages are swapped
                action1 ? setThink2(true) : setThink(true);
            } else {
                // Before collision, normal behavior
            action1 ? setThink(true) : setThink2(true);
            }
        }, (i* 1500));
        
        // Clear message after display
        safeSetTimeout(()=>{
            if (currentAction === 'Think See you') {
                setThink(false);
                setThink2(false);
                setCurrentAction('');
            }
        }, (i*1500) + 100); // Small delay to ensure message shows
    }

    function moveXY(xInput, yInput, random, i, action1) {
        // combined function to move to random postion and to x, y cordinates  
        safeSetTimeout(()=>{
            let tempR = parseInt(action1 ? r.slice(0,-1) : r2.slice(0,-1));
            let tempT = parseInt(action1 ? t.slice(0,-1) : t2.slice(0,-1));
            // asign the x, y values 
            // or to random values 
            tempR = tempR !== parseInt(xInput) && parseInt(xInput) !== 0 
                ? (random ? Math.floor((Math.random() * (-290-290)) +290) : parseInt(xInput)) 
                : tempR;
            tempT = tempT !== (-parseInt(yInput)) && parseInt(yInput) !== 0 
                ? (random ? Math.floor((Math.random() * (-140-140)) + 140) : -parseInt(yInput)) 
                : tempT;
            if(parseInt(yInput)===0){
                tempT = 0;
            }
            if (parseInt(xInput)===0){
                tempR = 0;
            }
            //return to intial if it is out of bounds 
            if(tempR<-290 || tempR>290 || tempT<-140 || tempT>140){
                refresh(WARN_MSG_POS);
                return
            }
            let valueR = tempR.toString();
            let valueT = tempT.toString();

            if(action1){
                r = valueR.concat('%');
                t = valueT.concat('%');
            } else {
                r2 = valueR.concat('%');
                t2 = valueT.concat('%');
            }
            // apply tarnsform for respective sprite
            action1 ? ref.current.style.transform = `scale(${scale})translate(${r}, ${t}) rotate(${angle}deg)`
                : ref2.current.style.transform = `scale(${scale2})translate(${r2}, ${t2}) rotate(${angle2}deg)`;
        }, (i * 1500));
    }
    const rotate = (rAngle, i, action1, cloneId = null) => {
        safeSetTimeout(() => {
            if (cloneId) {
                const clone = clonedSprites.find(c => c.id === cloneId);
                if (!clone) return;
                
                const newAngle = clone.angle + rAngle;
                animateClonedSprite(cloneId, 'angle', newAngle);
                return;
            }
            
            //rotate the sprite 
            action1 ? angle += rAngle : angle2 += rAngle;
            // apply transform for respective sprite
            action1 ? ref.current.style.transform = `scale(${scale})translate(${r}, ${t}) rotate(${angle}deg)`
                : ref2.current.style.transform = `scale(${scale2})translate(${r2}, ${t2}) rotate(${angle2}deg)`;
        }, (i * 1500));
    }
    function handleScale(size, increase, idx, action1, cloneId = null) {
        //combined function to scale from resize component and resize action item 
        // If size is provided, we're using the Resize component
        if (size) {
            // For clones, don't handle resize component directly
            if (cloneId) return;
            
            const isFirstSprite = activeSprite === 1;
            let newScale = size === 'medium' ? 2 : (size === 'large' ? 3 : 1);
            
            if (isFirstSprite) {
                scale = newScale;
                ref.current.style.transform = `scale(${newScale}) translate(${r}, ${t}) rotate(${angle}deg)`;
            } else if (sprite2) {
                scale2 = newScale;
                ref2.current.style.transform = `scale(${newScale}) translate(${r2}, ${t2}) rotate(${angle2}deg)`;
            }
            return;
        }
        
        // If no size provided, we're using the action items (increase/decrease)
        if (increase) {
            safeSetTimeout(() => {
                if (cloneId) {
                    const clone = clonedSprites.find(c => c.id === cloneId);
                    if (!clone) return;
                    
                    const newScale = clone.scale + 0.2;
                    if (newScale < 3) {
                        animateClonedSprite(cloneId, 'scale', newScale);
                    } else {
                        refresh(WARN_MSG_SIZE);
                    }
                    return;
                }
                
                action1 ? scale += 0.2 : scale2 += 0.2;
                if (action1) {
                    if (scale < 3) {
                        ref.current.style.transform = `scale(${scale})translate(${r}, ${t}) rotate(${angle}deg)`;
                    } else {
                        refresh(WARN_MSG_SIZE);
                    }
                } else {
                    if (scale2 < 3) {
                        ref2.current.style.transform = `scale(${scale2})translate(${r2}, ${t2}) rotate(${angle2}deg)`;
                    } else {
                        refresh(WARN_MSG_SIZE);
                    }
                }
            }, idx * 1500);
            return;
        } else {
            safeSetTimeout(() => {
                if (cloneId) {
                    const clone = clonedSprites.find(c => c.id === cloneId);
                    if (!clone) return;
                    
                    const newScale = clone.scale - 0.2;
                    if (newScale > 0.5) {
                        animateClonedSprite(cloneId, 'scale', newScale);
                    } else {
                        refresh(WARN_MSG_SIZE);
                    }
                    return;
                }
                
                action1 ? scale -= 0.2 : scale2 -= 0.2;
                if (action1) {
                    if (scale > 0.5) {
                        ref.current.style.transform = `scale(${scale})translate(${r}, ${t}) rotate(${angle}deg)`;
                    } else {
                        refresh(WARN_MSG_SIZE);
                    }
                } else {
                    if (scale2 > 0.5) {
                        ref2.current.style.transform = `scale(${scale2})translate(${r2}, ${t2}) rotate(${angle2}deg)`;
                    } else {
                        refresh(WARN_MSG_SIZE);
                    }
                }
            }, idx * 1500);
            return;
        }
    }

    const startActions = (action, idx, action1, cloneId = null) => {
        if (!isAnimating) return;
        const delay = idx * 1500;

        switch(action) {
            case 'Move 50 steps': {
                safeSetTimeout(() => moveRight(idx, action1, cloneId), delay);
                break;
            }
            case 'Move up 50 steps': {
                safeSetTimeout(() => moveUp(idx, action1, cloneId), delay);
                break;
            }
            case 'Move -50 steps': {
                safeSetTimeout(() => moveLeft(idx, action1, cloneId), delay);
                break;
            }
            case 'Move down 50 steps': {
                safeSetTimeout(() => moveDown(idx, action1, cloneId), delay);
                break;
            }
            case 'turn 45 degrees': {
                safeSetTimeout(() => rotate(45, idx, action1, cloneId), delay);
                break;
            }
            case 'turn 90 degrees': {
                safeSetTimeout(() => rotate(90, idx, action1, cloneId), delay);
                break;
            }
            case 'turn 135 degrees': {
                safeSetTimeout(() => rotate(135, idx, action1, cloneId), delay);
                break;
            }
            case 'turn 180 degrees': {
                safeSetTimeout(() => rotate(180, idx, action1, cloneId), delay);
                break;
            }
            case 'turn 360 degrees': {
                safeSetTimeout(() => rotate(360, idx, action1, cloneId), delay);
                break;
            }
            case 'Say Hello for 5 sec': {
                safeSetTimeout(() => sayHello(idx, action1), delay);
                break;
            }
            case 'Think Hmmm for 3 sec': {
                safeSetTimeout(() => thinkHmmm(idx, action1), delay);
                break;
            }
            case 'Say Bye': {
                safeSetTimeout(() => sayBye(idx, action1), delay);
                break;
            }
            case 'Say Hii': {
                safeSetTimeout(() => sayHii(idx, action1), delay);
                break;
            }
            case 'Think See you': {
                safeSetTimeout(() => thinkSeeYou(idx, action1), delay);
                break;
            }
            case 'Go to random position': {
                if (cloneId) {
                    safeSetTimeout(() => {
                        const clone = clonedSprites.find(c => c.id === cloneId);
                        if (!clone) return;
                        
                        const randomX = Math.floor((Math.random() * (-290-290)) + 290);
                        const randomY = Math.floor((Math.random() * (-140-140)) + 140);
                        
                        if (randomX < -290 || randomX > 290 || randomY < -140 || randomY > 140) {
                            refresh(WARN_MSG_POS);
                            return;
                        }
                        
                        animateClonedSprite(cloneId, 'x', randomX);
                        animateClonedSprite(cloneId, 'y', randomY);
                    }, delay);
                } else {
                    safeSetTimeout(() => moveXY(1, 1, true, idx, action1), delay);
                }
                break;
            }
            case 'Go to x: 0 y: 0': {
                if (cloneId) {
                    safeSetTimeout(() => {
                        animateClonedSprite(cloneId, 'x', 0);
                        animateClonedSprite(cloneId, 'y', 0);
                    }, delay);
                } else {
                    safeSetTimeout(() => moveXY(0, 0, false, idx, action1), delay);
                }
                break;
            }
            case 'size decrease': {
                safeSetTimeout(() => handleScale('', false, idx, action1, cloneId), delay);
                break;
            }
            case 'size increase': {
                safeSetTimeout(() => handleScale('', true, idx, action1, cloneId), delay);
                break;
            }
            case 'repeat': {
                // For clones, mark them as edited when they use repeat
                if (cloneId) {
                    safeSetTimeout(() => {
                        setIsCloneEdited(prev => ({
                            ...prev,
                            [cloneId]: true
                        }));
                        
                        const cloneActions = clonedActions[cloneId] || [];
                        if (cloneActions.length) {
                            cloneActions.forEach((item, i) => {
                                startActions(item.todo, i, action1, cloneId);
                            });
                        }
                    }, delay);
                    break;
                }
                
                const maxDelay = Math.max(
                    actions?.length || 0,
                    actions2?.length || 0
                ) * 1500;

                safeSetTimeout(() => {
                    // If this is the first sprite's repeat
                    if(action1) {
                        // Check if second sprite also has repeat
                        const sprite2HasRepeat = actions2?.some(item => item.todo === 'repeat');
                        if(sprite2HasRepeat) {
                            // Both sprites have repeat, restart both after all current animations finish
                            safeSetTimeout(() => {
                                clearAllTimeouts();
                                setIsAnimating(true);
                                runAction1();
                                runAction2();
                            }, maxDelay);
                        } else {
                            // Only first sprite has repeat
                            runAction1();
                        }
                    } else {
                        // If this is the second sprite's repeat
                        const sprite1HasRepeat = actions?.some(item => item.todo === 'repeat');
                        if(sprite1HasRepeat) {
                            // Both sprites have repeat, restart both after all current animations finish
                            safeSetTimeout(() => {
                                clearAllTimeouts();
                                setIsAnimating(true);
                                runAction1();
                                runAction2();
                            }, maxDelay);
                        } else {
                            // Only second sprite has repeat
                            runAction2();
                        }
                    }
                }, delay);
                break;
            }
            case 'Clone Sprite': {
                if (cloneId) return; // Don't allow clones to clone themselves
                safeSetTimeout(() => {
                    cloneSprite(idx, action1 ? 1 : 2);
                }, delay);
                break;
            }
            default: break;
        }
    };

    // Function to check collision between two sprites
    const checkCollision = () => {
        if (!ref.current || !ref2.current || !sprite2) return false;
        
        const rect1 = ref.current.getBoundingClientRect();
        const rect2 = ref2.current.getBoundingClientRect();
        
        // Calculate the actual sprite dimensions (accounting for scale)
        const sprite1Width = rect1.width * 0.7;  // Increased collision area
        const sprite1Height = rect1.height * 0.7;
        const sprite2Width = rect2.width * 0.7;
        const sprite2Height = rect2.height * 0.7;

        // Calculate centers of both sprites
        const center1X = rect1.left + rect1.width / 2;
        const center1Y = rect1.top + rect1.height / 2;
        const center2X = rect2.left + rect2.width / 2;
        const center2Y = rect2.top + rect2.height / 2;

        // Calculate the distance between centers
        const distanceX = Math.abs(center1X - center2X);
        const distanceY = Math.abs(center1Y - center2Y);

        // Check if the sprites are actually overlapping with a slightly larger detection area
        return (distanceX < (sprite1Width + sprite2Width) / 2.2) && 
               (distanceY < (sprite1Height + sprite2Height) / 2.2);
    };

    // Function to swap animations between sprites
    const swapAnimations = () => {
        if (!hasSwappedAnimations && actions?.length > 0 && actions2?.length > 0) {
            clearAllTimeouts();
            setIsAnimating(false);  // Stop current animations
            
            // Clear all messages immediately
            setHello(false);
            setHello2(false);
            setThink(false);
            setThink2(false);
            setCurrentAction('');
            
            // Store current positions and states
            const tempActions = [...actions];
            const tempActions2 = [...actions2];
            
            // Swap actions
            setActions(tempActions2);
            setActions2(tempActions);
            
            setHasSwappedAnimations(true);
            
            // Show collision notification
            toast.info("Sprites collided! Animations swapped!", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            // Restart animations with swapped behaviors after a short delay
            safeSetTimeout(() => {
                setIsAnimating(true);
                
                // Start both animations simultaneously with swapped actions
                if (tempActions2.length) {
                    tempActions2.forEach((item, i) => {
                        startActions(item.todo, i, true);
                    });
                }
                
                if (tempActions.length) {
                    tempActions.forEach((item, i) => {
                        startActions(item.todo, i, false);
                    });
                }
            }, 500);
        }
    };

    const handlePlay = () => {
        // Clear any existing animations and states
        clearAllTimeouts();
        setIsAnimating(false);
        setIsColliding(false);
        setHasSwappedAnimations(false);
        setHello(false);
        setHello2(false);
        setThink(false);
        setThink2(false);
        setCurrentAction('');
        
        // Reset positions
        r = '0%';
        t = '0%';
        r2 = '0%';
        t2 = '0%';
        scale = 1;
        angle = 0;
        scale2 = 1;
        angle2 = 0;

        // Apply initial transforms
        if (ref.current) {
            ref.current.style.transform = `scale(${scale}) translate(${r}, ${t}) rotate(${angle}deg)`;
        }
        if (ref2.current) {
            ref2.current.style.transform = `scale(${scale2}) translate(${r2}, ${t2}) rotate(${angle2}deg)`;
        }

        // Start animations immediately
        setIsAnimating(true);
        
        // Start both sprites' animations simultaneously
        if (actions?.length) {
            actions.forEach((item, i) => {
                startActions(item.todo, i, true);
            });
        }
            
        if (!displayAddIcon && actions2?.length) {
            actions2.forEach((item, i) => {
                startActions(item.todo, i, false);
            });
        }

        // Start cloned sprites animations
        clonedSprites.forEach(clone => {
            const cloneActions = clonedActions[clone.id] || [];
            if (cloneActions.length) {
                cloneActions.forEach((item, i) => {
                    startActions(item.todo, i, clone.sourceSprite === 1, clone.id);
                });
            }
        });
    };

    const refresh = (msg) => {
        clearAllTimeouts();
        setIsAnimating(false);
        setIsColliding(false);
        setHasSwappedAnimations(false);
        setCurrentAction('');
        setHello(false);
        setHello2(false);
        setThink(false);
        setThink2(false);
        
        // Reset positions
        r = '0%';
        t = '0%';
        r2 = '0%';
        t2 = '0%';
        scale = 1;
        angle = 0;
        scale2 = 1;
        angle2 = 0;

        // Reset cloned sprites
        setClonedSprites([]);
        setClonedActions({});
        setIsCloneEdited({});

        // Apply transforms
        if (ref.current) {
            ref.current.style.transform = `scale(${scale}) translate(${r}, ${t}) rotate(${angle}deg)`;
        }
        if (ref2.current) {
            ref2.current.style.transform = `scale(${scale2}) translate(${r2}, ${t2}) rotate(${angle2}deg)`;
        }

        if (msg) {
            toast.warn(msg, {
                position: "top-center",
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    };

    //function to start the actions
    //send true as a parameter if the actions are for the first sprite else false 
    function runAction1(){
        if (actions?.length) {
            actions.forEach((item, i) => {
                startActions(item.todo, i, true);
            });
        }
    }
    
    function runAction2(){
        if (!displayAddIcon && actions2?.length) {
            actions2.forEach((item, i) => {
                startActions(item.todo, i, false);
            });
        }
    }
    
    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        const categoryElement = movesContainerRef.current?.querySelector(`[data-category="${category}"]`);
        if (categoryElement) {
            categoryElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const renderCategory = (categoryName, color, moves) => {
        const categoryMoves = moves?.filter(move => move.category === categoryName);
        if (!categoryMoves || categoryMoves.length === 0) return null;

        return (
            <div className="moves__category" data-category={categoryName}>
                <div className="category__heading">
                    {categoryName}
                </div>
                {categoryMoves.map((move) => (
                    <SingleAction
                        disableDelete={true}
                        index={moves.findIndex(m => m.id === move.id)}
                        moves={moves}
                        move={move}
                        key={move.id}
                        setMoves={setMoves}
                    />
                ))}
            </div>
        );
    };

    // Update collision effect with better message handling
    useEffect(() => {
        let collisionInterval;
        let lastCollisionState = false;
        
        if (isAnimating && !displayAddIcon && ref.current && ref2.current && sprite2) {
            collisionInterval = setInterval(() => {
                if (!isAnimating) return;
                
                const collision = checkCollision();
                if (collision !== lastCollisionState) {
                    lastCollisionState = collision;
                    if (collision) {
                        // On collision
                        setIsColliding(true);
                        // Clear any existing messages before swap
                        setHello(false);
                        setHello2(false);
                        setThink(false);
                        setThink2(false);
                        setCurrentAction('');
                        swapAnimations();
                    } else {
                        // When sprites separate
                        setIsColliding(false);
                        // Reset hasSwappedAnimations when sprites separate
                        // This allows for new swaps on next collision
                        setHasSwappedAnimations(false);
                        // Clear messages
                        setHello(false);
                        setHello2(false);
                        setThink(false);
                        setThink2(false);
                        setCurrentAction('');
                    }
                }
            }, 30);
        }

        return () => {
            if (collisionInterval) {
                clearInterval(collisionInterval);
            }
        };
    }, [isAnimating, displayAddIcon, sprite2, isColliding]);

    // Add CSS for better collision visualization
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .sprite-colliding {
                animation: collision-pulse 0.4s infinite;
                filter: brightness(1.3) contrast(1.2);
                box-shadow: 0 0 10px rgba(255,255,0,0.5);
            }
            @keyframes collision-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    setCustomBackground(result);
                    setTheme(true);
                    // Show success message
                    toast.success('Background image uploaded successfully!', {
                        position: "top-center",
                        autoClose: 2000,
                    });
                }
            };
            reader.onerror = () => {
                // Show error message if upload fails
                toast.error('Failed to upload image. Please try again.', {
                    position: "top-center",
                    autoClose: 2000,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBackdropChange = (backdropUrl) => {
        if (backdropUrl === null) {
            setTheme(false);
            setCustomBackground('');
            toast.info('Backdrop removed!', {
                position: "top-center",
                autoClose: 2000,
            });
        } else {
            setTheme(true);
            setCustomBackground(backdropUrl);
            toast.success('Backdrop changed successfully!', {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    // Function to clone a sprite
    const cloneSprite = (i, spriteToClone) => {
        safeSetTimeout(() => {
            const isFirstSprite = spriteToClone === 1;
            const cloneId = new Date().getTime(); // Unique ID for the clone
            
            // Create a new cloned sprite
            const newClonedSprite = {
                id: cloneId,
                sourceSprite: spriteToClone,
                sprite: isFirstSprite ? sprite : sprite2,
                x: isFirstSprite ? parseInt(r.slice(0,-1)) : parseInt(r2.slice(0,-1)),
                y: isFirstSprite ? parseInt(t.slice(0,-1)) : parseInt(t2.slice(0,-1)),
                scale: isFirstSprite ? scale : scale2,
                angle: isFirstSprite ? angle : angle2,
                actions: isFirstSprite ? [...actions] : [...actions2],
            };
            
            // Add the new cloned sprite
            setClonedSprites(prevClones => [...prevClones, newClonedSprite]);
            setClonedActions(prevActions => ({
                ...prevActions,
                [cloneId]: isFirstSprite ? [...actions] : [...actions2]
            }));
            setIsCloneEdited(prevEdited => ({
                ...prevEdited,
                [cloneId]: false
            }));
            
            // Notify user
            toast.success(`Sprite ${isFirstSprite ? 1 : 2} cloned successfully!`, {
                position: "top-center",
                autoClose: 2000,
            });
        }, i * 1500);
    };

    // Function to update cloned sprites when original sprite changes
    useEffect(() => {
        // Only update clones that haven't been edited
        setClonedSprites(prevClones => 
            prevClones.map(clone => {
                if (isCloneEdited[clone.id]) return clone;
                
                if (clone.sourceSprite === 1) {
                    // Update clone's actions from sprite 1
                    setClonedActions(prevActions => ({
                        ...prevActions,
                        [clone.id]: [...actions]
                    }));
                    return {
                        ...clone,
                        actions: [...actions]
                    };
                }
                return clone;
            })
        );
    }, [actions, isCloneEdited]);

    // Function to update cloned sprites when second original sprite changes
    useEffect(() => {
        // Only update clones that haven't been edited
        setClonedSprites(prevClones => 
            prevClones.map(clone => {
                if (isCloneEdited[clone.id]) return clone;
                
                if (clone.sourceSprite === 2) {
                    // Update clone's actions from sprite 2
                    setClonedActions(prevActions => ({
                        ...prevActions,
                        [clone.id]: [...actions2]
                    }));
                    return {
                        ...clone,
                        actions: [...actions2]
                    };
                }
                return clone;
            })
        );
    }, [actions2, isCloneEdited]);

    return (
        <div className='mainContainer'>
            <ToastContainer />
            <div className="container">
                <CategorySidebar 
                    activeCategory={activeCategory}
                    onCategoryClick={handleCategoryClick}
                />
                <Droppable droppableId="MovesList">
                    {(provided) => (
                        <div 
                            className="moves" 
                            ref={(el) => {
                                provided.innerRef(el);
                                movesContainerRef.current = el;
                            }}
                            {...provided.droppableProps}
                        >
                            <div className='moves__heading'>
                                Moves
                            </div>
                            {renderCategory('Motion', null, moves)}
                            {renderCategory('Looks', null, moves)}
                            {renderCategory('Control', null, moves)}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                <Droppable droppableId="MovesActions">
                    {(provided) => (
                    <div 
                        className="moves actions"
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                    >
                        <span className='moves__heading'>
                            Action
                        </span>
                         {actions?.map((move, index) => (
                            <SingleAction
                                index={index}
                                moves={actions}
                                move={move}
                                key={move.id}
                                refresh={refresh}
                                setMoves={setActions}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                    )}
                </Droppable>

                {displayAddIcon && 
                <div style={{display:'flex', flexDirection:'column' ,justifyContent:'center', alignItems:'center'}}>
                <div className="icon">
                    <AddBoxIcon sx={{color:'gray', cursor:'pointer'}} onClick={()=>{
                        setDisplayAddIcon(!displayAddIcon);
                        setSprite2(require('../Assets/images/cockroach1.png'));
                        refresh();
                    }}/>
                    <span className="tooltiptext">add sprite</span>
                </div>
                <div><DeleteIcon onClick={()=>{setActions([])}} sx={{cursor:'pointer', fontSize:'30px',color:'Grey'}}/></div>
                </div>
                }
                {!displayAddIcon &&
                    <Droppable droppableId="MovesActions2">
                        {(provided) => (
                        <div 
                            className="moves actions"
                            ref={provided.innerRef} 
                            {...provided.droppableProps}
                        >
                            <span className='moves__heading'>
                                Action 2
                            </span>
                            {actions2?.map((move, index) => (
                                <SingleAction
                                    index={index}
                                    moves={actions2}
                                    move={move}
                                    key={move.id}
                                    refresh={refresh}
                                    setMoves={setActions2}
                                />
                            ))}
                            {provided.placeholder}
                            
                        </div>
                        )}
                    </Droppable>
                }
                {!displayAddIcon &&
                    <div className="icon">
                        <DisabledByDefaultIcon sx={{color:'gray', cursor:'pointer'}} onClick={()=>{
                            setDisplayAddIcon(!displayAddIcon);
                            setSprite2(null);
                            refresh();
                        }}/>
                        <div><DeleteIcon onClick={()=>{setActions([]);setActions2([])}} sx={{cursor:'pointer', fontSize:'30px',color:'Grey'}}/></div>
                    </div>
                }

                <div className="moves play" 
                    style={{
                        background: theme ? (
                            customBackground ? `url(${customBackground})` : 'white'
                        ) : 'white',
                        backgroundSize: theme ? 'cover' : undefined,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        position: 'relative'
                    }}
                >
                    <BackdropMenu onBackdropChange={handleBackdropChange} />
                    <div style={{display:'flex', flexDirection:"row", flexWrap: "wrap", justifyContent: "center"}}> 
                        {/* Original Sprite 1 */}
                        <Draggable1 bounds= {{left: -540, top: -250, right:540, bottom:250}}>
                            <div ref={ref} style={{
                                position:'relative',
                                transition:'1s all ease'}}
                                onMouseEnter={() => setActiveSprite(1)}
                            >
                            {hello ?
                                <div style={{transition:"0s all ease"}} className='msgPopup'>
                                    {currentAction === 'Say Hello for 5 sec' ? 'hello!' :
                                     currentAction === 'Say Bye' ? 'bye!' :
                                     currentAction === 'Say Hii' ? 'hii!' : ''}
                                </div>
                                : null
                            }
                            {think ?
                                <div style={{transition:"0s all ease"}} className='thinkPopup'>
                                    {currentAction === 'Think Hmmm for 3 sec' ? 'hmmm...' :
                                     currentAction === 'Think See you' ? 'see you...' : ''}
                                </div>
                                : null
                            }
                            <img 
                                src={sprite} 
                                alt="Sprite 1"
                                draggable='false'
                                className={isColliding ? 'sprite-colliding' : ''}
                                style={{
                                    cursor:"pointer",
                                    position:'relative',
                                    height: 160, 
                                    width: 160,
                                    objectFit: 'contain',
                                    transition: '1s all ease'
                                }}
                            />
                            </div>
                        </Draggable1>

                        {/* Sprite 2 (if visible) */}
                        {!displayAddIcon && 
                        <Draggable1 bounds= {{left: -540, top: -250, right:540, bottom:250}}>
                            <div ref={ref2} style={{
                                position:'relative',
                                transition:'1s all ease'}}
                                onMouseEnter={() => setActiveSprite(2)}
                            >
                            {hello2 ?
                                <div style={{transition:"0s all ease"}} className='msgPopup'>
                                    {currentAction === 'Say Hello for 5 sec' ? 'hello!' :
                                     currentAction === 'Say Bye' ? 'bye!' :
                                     currentAction === 'Say Hii' ? 'hii!' : ''}
                                </div>
                                : null
                            }
                            {think2 ?
                                <div style={{transition:"0s all ease"}} className='thinkPopup'>
                                    {currentAction === 'Think Hmmm for 3 sec' ? 'hmmm...' :
                                     currentAction === 'Think See you' ? 'see you...' : ''}
                                </div>
                                : null
                            }
                            <img 
                                src={sprite2}
                                alt="Sprite 2" 
                                draggable='false'
                                className={isColliding ? 'sprite-colliding' : ''}
                                style={{
                                    cursor:"pointer",
                                    position:'relative',
                                    height: 160,
                                    width: 160,
                                    objectFit: 'contain',
                                    transition: '1s all ease'
                                }}
                            />
                            </div>
                        </Draggable1>}

                        {/* Cloned Sprites */}
                        {clonedSprites.map(clone => (
                            <Draggable1 key={clone.id} bounds={{left: -540, top: -250, right:540, bottom:250}}>
                                <div 
                                    ref={el => {
                                        if (el) {
                                            clonedRefsMap.current.set(clone.id, el);
                                            // Initial positioning
                                            el.style.transform = `scale(${clone.scale}) translate(${clone.x}%, ${clone.y}%) rotate(${clone.angle}deg)`;
                                        }
                                    }}
                                    style={{
                                        position: 'relative',
                                        transition: '1s all ease',
                                        border: '2px dashed #FFAB19',  // Orange dashed border to indicate clone
                                        borderRadius: '5px',
                                        padding: '2px'
                                    }}
                                >
                                    <div style={{position: 'absolute', top: '-25px', right: '-10px', zIndex: 10}}>
                                        <ContentCopyIcon sx={{color: '#FFAB19', fontSize: '20px'}} />
                                    </div>
                                    <img 
                                        src={clone.sprite} 
                                        alt={`Cloned Sprite ${clone.id}`}
                                        draggable='false'
                                        style={{
                                            cursor: "pointer",
                                            position: 'relative',
                                            height: 160,
                                            width: 160,
                                            objectFit: 'contain',
                                            transition: '1s all ease'
                                        }}
                                    />
                                </div>
                            </Draggable1>
                        ))}
                    </div>
                </div>
            </div>

            <div className="gameProps">
                <Sprites setSprite={setSprite} setSprite2={setSprite2} displayAddIcon={displayAddIcon} sprite2={sprite2} sprite={sprite} />
                
                <div className='playRefresh'>
                    <Button variant="contained" 
                        sx={{borderRadius:"20px", marginRight:'5px', height:"40px", width:'80px'}}  
                        color='success' 
                        onClick={handlePlay}
                    >
                        <PlayArrowIcon />
                    </Button>
                    <Button variant="contained" 
                        sx={{borderRadius:"20px", height:"40px", width:'80px'}} 
                        color='error' 
                        onClick={refresh}
                    >
                        <RefreshIcon sx={{color:'white'}}/>
                    </Button>
                </div>
                <Positions handleMove={moveXY} refresh={refresh} />
                <Resize setSize={handleScale} size={'small'}/>
            </div>
        </div>
    );
}
export default EventBody;