import React from 'react'
import { useDispatch } from 'react-redux';
import {modelSlice} from '../store/slices/model'

interface FloorButtonProps {
    floorIndex: number;
    animationHandler: () => void;
}

const FloorButton: React.FC<FloorButtonProps> = ({ floorIndex, animationHandler }) => {
    const dispatch = useDispatch()


  return (
    <button 
        className='model__sidebar-btn'
        onClick={() => {
            dispatch(modelSlice.actions.selectFloor(floorIndex))
            animationHandler()
        }}
    >
        Floor {floorIndex + 1}
    </button>
  )
}

export default FloorButton