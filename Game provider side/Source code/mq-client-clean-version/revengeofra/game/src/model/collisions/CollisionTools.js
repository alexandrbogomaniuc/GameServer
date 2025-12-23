export function isCircleCollision(circle1, circle2) 
{
    return Math.sqrt(Math.pow(circle1.centerX - circle2.centerX, 2) + Math.pow(circle1.centerY - circle2.centerY, 2)) < circle1.radius + circle2.radius
}

export function getCirclesCollision (baseCircle, compareCircles) 
{
    var lCollisionComponents = null;

    for (let i=0; i<compareCircles.length; i++)
    {
        let compareCircle = compareCircles[i];
        if (isCircleCollision(baseCircle, compareCircle))
        {
            lCollisionComponents = [baseCircle, compareCircle];
            break;
        }
    }

    return lCollisionComponents;
}

export function isRectangleCircleCollision (rect, circle) 
{
    var r = {
        x: 0,
        y: 0
    }, i;

    return circle.centerX < rect.centerX - .5 * rect.width ? r.x = rect.centerX - .5 * rect.width : circle.centerX > rect.centerX + .5 * rect.width ? r.x = rect.centerX + .5 * rect.width : r.x = circle.centerX,
    circle.centerY < rect.centerY - .5 * rect.height ? r.y = rect.centerY - .5 * rect.height : circle.centerY > rect.centerY + .5 * rect.height ? r.y = rect.centerY + .5 * rect.height : r.y = circle.centerY,
    Math.sqrt(Math.pow(r.x - circle.centerX, 2) + Math.pow(r.y - circle.centerY, 2)) < circle.radius
}

export function getRectanglesCircleCollision(rects, circle)
{

    var lCollisionComponents = null;

    for (let i=0; i<rects.length; i++)
    {
        let compareRect = rects[i];
        if (isRectangleCircleCollision(compareRect, circle))
        {
            lCollisionComponents = [circle, compareRect];
            break;
        }
    }

    return lCollisionComponents;
}

export function isPointInsideRect(rect, point)
{
    if (
            point.x < rect.x
            || point.x > rect.x+rect.width
            || point.y < rect.y
            || point.y > rect.y+rect.height
        )
    {
        return false;
    }

    return true;
}