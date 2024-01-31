function calculateDotProduct(vector1, vector2) {
    const product = vector1.x * vector2.x + vector1.y * vector2.y;
    return product;
}
// This can absolutley be optimized
export function calculateStepPath(source, target, buffer) {
    const steps = [];
    const deltaX = target.x - source.x;
    const deltaY = target.y - source.y;
    const sameDirection = areVectorsEqual(source.direction, target.direction);
    const orthogonal = calculateDotProduct(source.direction, target.direction) === 0;
    const crossing = areCrossing(source, target);
    const oppositeSource = multiply(source.direction, -1, -1);
    const oppositeTarget = multiply(target.direction, -1, -1);
    const perpendicularSource = { x: Math.abs(source.direction.y), y: Math.abs(source.direction.x) };
    const sourceDirectionDelta = multiply(source.direction, deltaX - buffer * source.direction.x * (orthogonal ? 1 : sameDirection ? 0 : 2), deltaY - buffer * source.direction.y * (orthogonal ? 1 : sameDirection ? 0 : 2));
    const targetDirectionDelta = multiply(target.direction, deltaX + buffer * target.direction.x * (orthogonal ? 1 : sameDirection ? 0 : 2), deltaY + buffer * target.direction.y * (orthogonal ? 1 : sameDirection ? 0 : 2));
    const sourceReaching = Math.sign(sourceDirectionDelta.x) === -1 || Math.sign(sourceDirectionDelta.y) === -1;
    const targetReaching = Math.sign(targetDirectionDelta.x) === 1 || Math.sign(targetDirectionDelta.y) === 1;
    const absoluteX = Math.abs(deltaX);
    const absoluteY = Math.abs(deltaY);
    const sourceBuffer = multiply(source.direction, buffer, buffer);
    const oppositeTargetBuffer = multiply(oppositeTarget, buffer, buffer);
    const targetBuffer = multiply(target.direction, buffer, buffer);
    const fullSource = multiply(source.direction, absoluteX, absoluteY);
    const fullTarget = multiply(oppositeTarget, absoluteX, absoluteY);
    const halfSource = multiply(source.direction, absoluteX / 2, absoluteY / 2);
    const halfTarget = multiply(oppositeTarget, absoluteX / 2, absoluteY / 2);
    const fullDelta = multiply(perpendicularSource, deltaX, deltaY);
    const sourceFacingTarget = !crossing && !targetReaching && !sourceReaching;
    const sourceToXBuffer = source.x + sourceBuffer.x;
    const sourceToYBuffer = source.y + sourceBuffer.y;
    const targetToXBuffer = target.x + targetBuffer.x;
    const targetToYBuffer = target.y + targetBuffer.y;
    if (sourceReaching)
        steps.push(sourceBuffer);
    if (crossing && !targetReaching && !sourceReaching) {
        steps.push(fullSource);
        steps.push(fullTarget);
    }
    else if (sameDirection) {
        if (!sourceReaching) {
            steps.push(multiply(source.direction, buffer + absoluteX, buffer + absoluteY));
        }
        steps.push(fullDelta);
        if (!targetReaching) {
            steps.push(multiply(oppositeTarget, buffer + absoluteX, buffer + absoluteY));
        }
    }
    else if (sourceFacingTarget) {
        steps.push(halfSource);
        steps.push(fullDelta);
        steps.push(halfTarget);
    }
    else if (sourceReaching && targetReaching) {
        if (orthogonal) {
            const xReach = Math.abs(sourceToXBuffer - targetToXBuffer);
            const yReach = Math.abs(sourceToYBuffer - targetToYBuffer);
            steps.push(multiply(target.direction, absoluteX < buffer * 2
                ? target.direction.x * (deltaX + target.direction.x * buffer)
                : absoluteX + buffer, absoluteY < buffer * 2
                ? target.direction.y * (deltaY + target.direction.y * buffer)
                : absoluteY + buffer));
            steps.push(multiply(oppositeSource, xReach, yReach));
        }
        else {
            const xReach = Math.abs(sourceToXBuffer - targetToXBuffer);
            const yReach = Math.abs(sourceToYBuffer - targetToYBuffer);
            steps.push(multiply(perpendicularSource, deltaX / 2, deltaY / 2));
            steps.push(multiply(target.direction, xReach, yReach));
            steps.push(multiply(perpendicularSource, deltaX / 2, deltaY / 2));
        }
    }
    else if (sourceReaching) {
        const xReach = Math.abs(sourceToXBuffer - target.x);
        const yReach = Math.abs(sourceToYBuffer - target.y);
        steps.push(multiply(oppositeTarget, absoluteX < buffer * 2 ? absoluteX - buffer : absoluteX / 2, absoluteY < buffer * 2 ? absoluteY - buffer : absoluteY / 2));
        steps.push(multiply(oppositeSource, xReach, yReach));
        steps.push(multiply(oppositeTarget, Math.max(buffer, absoluteX / 2), Math.max(buffer, absoluteY / 2)));
    }
    else if (targetReaching) {
        const xReach = Math.abs(targetToXBuffer - source.x);
        const yReach = Math.abs(targetToYBuffer - source.y);
        steps.push(multiply(source.direction, Math.max(buffer, absoluteX / 2), Math.max(buffer, absoluteY / 2)));
        steps.push(multiply(target.direction, xReach, yReach));
        steps.push(multiply(source.direction, absoluteX < buffer * 2 ? absoluteX - buffer : absoluteX / 2, absoluteY < buffer * 2 ? absoluteY - buffer : absoluteY / 2));
    }
    if (targetReaching) {
        steps.push(oppositeTargetBuffer);
    }
    return steps;
}
export function areCrossing(vec1, vec2) {
    const { x: dx1, y: dy1 } = vec1.direction;
    const { x: dx2, y: dy2 } = vec2.direction;
    const deltaX = vec2.x - vec1.x;
    const deltaY = vec2.y - vec1.y;
    if (dx1 * dy2 === dx2 * dy1)
        return false;
    return ((Math.sign(deltaY) === Math.sign(dy1 + dy2)) !== (Math.sign(deltaX) === Math.sign(dx1 + dx2)));
}
function multiply(vector, deltaX, deltaY) {
    return { x: vector.x * deltaX, y: vector.y * deltaY };
}
function areVectorsEqual(vector1, vector2) {
    return vector1.x === vector2.x && vector1.y === vector2.y;
}
