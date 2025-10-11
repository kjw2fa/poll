import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';

export const Draggable = ({ id, children }: { id: string, children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : {};

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
};

export const Droppable = ({ id, children }: { id: number, children: React.ReactNode }) => {
    const { isOver, setNodeRef } = useDroppable({ id });
    const style = {
        backgroundColor: isOver ? '#f0f0f0' : undefined,
    };

    return (
        <td ref={setNodeRef} style={style} className="border border-gray-300 p-2">
            {children}
        </td>
    );
};
