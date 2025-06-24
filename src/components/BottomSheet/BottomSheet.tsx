import { useEffect, useRef, useState } from 'react';
import './BottomSheet.css';
import { useBottomSheetStore } from '../../store/useBottomSheetStore';

const BottomSheet: React.FC = () => {
  const { isOpen, close, content } = useBottomSheetStore();

  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragIconRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(50);

  const updateSheetHeight = (height: number) => {
    if (!contentRef.current || !sheetRef.current) return;
    contentRef.current.style.height = `${height}vh`;
    sheetRef.current.classList.toggle('fullscreen', height === 100);
  };

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    const clientY = 'touches' in event ? event.touches[0].pageY : event.pageY;
    setIsDragging(true);
    setStartY(clientY);
    setStartHeight(parseInt(contentRef.current?.style.height || '50'));
    sheetRef.current?.classList.add('dragging');
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientY = 'touches' in event ? event.touches[0].pageY : event.pageY;
      const delta = startY - clientY;
      const newHeight = startHeight + (delta / window.innerHeight) * 100;
      updateSheetHeight(newHeight);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      sheetRef.current?.classList.remove('dragging');

      const rawHeight = parseInt(contentRef.current?.style.height || '0', 10);
      if (rawHeight < 10) {
        close();
        return;
      }

      if (rawHeight > 75) {
        updateSheetHeight(100);
        return;
      }

      const roundedHeight = Math.min(Math.round(rawHeight / 10) * 10, 100);
      updateSheetHeight(roundedHeight);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, startY, startHeight]);

  useEffect(() => {
    if (isOpen) {
      sheetRef.current?.classList.add('show');
      document.body.style.overflowY = 'hidden';
      updateSheetHeight(50);
    } else {
      sheetRef.current?.classList.remove('show');
      document.body.style.overflowY = 'auto';
    }
  }, [isOpen]);

  return (
    <div ref={sheetRef} className="bottom-sheet">
      <div className="sheet-overlay" onClick={close}></div>
      <div ref={contentRef} className="content">
        <div className="header">
          <div
            ref={dragIconRef}
            className="drag-icon"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <span></span>
          </div>
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
};

export default BottomSheet;
