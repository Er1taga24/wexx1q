document.addEventListener('DOMContentLoaded', function() {
    fetch('/update_launch.php')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data.launches !== undefined) {
                var el = document.getElementById('launchesCount');
                if (el) el.textContent = data.launches;
                var communityValues = document.querySelectorAll('.home-community-card-value');
                if (communityValues.length >= 3) communityValues[2].textContent = data.launches + '+';
            }
        })
        .catch(function(e) {});
});

var currentReview = 0, totalReviews = 4, reviewInterval = null, isPaused = false, autoPlay = true, isDragging = false;

function getContainerWidth() { var c = document.querySelector('.reviews-carousel'); return c ? c.offsetWidth : window.innerWidth; }
function getItemWidth() { var items = document.querySelectorAll('.review-item'); return items.length ? items[0].offsetWidth : 300; }
function getGap() { return 20; }
function getVisibleCount() { var w = getContainerWidth(); if (w >= 1024) return 3; if (w >= 768) return 2; return 1; }
function getMaxOffset() {
    var track = document.getElementById('reviewsTrack');
    if (!track) return 0;
    var items = track.querySelectorAll('.review-item');
    if (!items.length) return 0;
    var totalWidth = items.length * (getItemWidth() + getGap());
    return Math.max(0, totalWidth - (getContainerWidth() - 20));
}
function getTargetOffset(index) {
    var targetOffset = index * (getItemWidth() + getGap());
    if (getVisibleCount() > 1) {
        var centerOffset = (getContainerWidth() - 20 - getItemWidth()) / 2;
        targetOffset = Math.max(0, targetOffset - centerOffset + (getItemWidth() / 2));
    }
    return Math.min(targetOffset, getMaxOffset());
}
function updateReviews(animate) {
    var track = document.getElementById('reviewsTrack');
    if (!track) return;
    var items = track.querySelectorAll('.review-item');
    if (!items.length) return;
    track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
    track.style.transform = 'translateX(-' + getTargetOffset(currentReview) + 'px)';
    items.forEach(function(item, i) { item.classList.toggle('active', i === currentReview); });
    document.querySelectorAll('.reviews-dots .dot').forEach(function(dot, i) { dot.classList.toggle('active', i === currentReview); });
}
function nextReview() { if (totalReviews === 0) return; currentReview = (currentReview < totalReviews - 1) ? currentReview + 1 : 0; updateReviews(true); resetReviewInterval(); }
function goToReview(index) { if (totalReviews === 0 || index < 0 || index >= totalReviews) return; currentReview = index; updateReviews(true); resetReviewInterval(); }
function startReviewInterval() { if (reviewInterval) clearInterval(reviewInterval); if (totalReviews <= 1) return; reviewInterval = setInterval(function() { if (!isPaused && autoPlay) nextReview(); }, 7000); }
function resetReviewInterval() { if (reviewInterval) { clearInterval(reviewInterval); reviewInterval = null; } startReviewInterval(); }
function pauseReviews() { isPaused = true; }
function resumeReviews() { isPaused = false; resetReviewInterval(); }

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { updateReviews(false); }, 100);
    startReviewInterval();
    var reviewsSection = document.getElementById('reviews');
    if (reviewsSection) { reviewsSection.addEventListener('mouseenter', pauseReviews); reviewsSection.addEventListener('mouseleave', resumeReviews); }

    var track = document.getElementById('reviewsTrack');
    if (track) {
        var touchStartX = 0, touchCurrentX = 0;
        track.addEventListener('touchstart', function(e) { isDragging = true; touchStartX = e.touches[0].clientX; touchCurrentX = touchStartX; track.style.transition = 'none'; pauseReviews(); }, { passive: true });
        track.addEventListener('touchmove', function(e) { if (!isDragging) return; touchCurrentX = e.touches[0].clientX; var diff = touchCurrentX - touchStartX; track.style.transform = 'translateX(-' + Math.max(0, Math.min(getTargetOffset(currentReview) - diff, getMaxOffset())) + 'px)'; }, { passive: true });
        track.addEventListener('touchend', function(e) { if (!isDragging) return; isDragging = false; var diff = touchStartX - touchCurrentX; if (Math.abs(diff) > 40) { diff > 0 ? nextReview() : (currentReview > 0 ? (currentReview--, updateReviews(true), resetReviewInterval()) : null); } else { updateReviews(true); } resumeReviews(); }, { passive: true });

        var mouseStartX = 0, mouseCurrentX = 0;
        track.addEventListener('mousedown', function(e) { if (e.button !== 0) return; isDragging = true; mouseStartX = e.clientX; mouseCurrentX = mouseStartX; track.style.transition = 'none'; track.style.cursor = 'grabbing'; pauseReviews(); });
        document.addEventListener('mousemove', function(e) { if (!isDragging) return; mouseCurrentX = e.clientX; var diff = mouseCurrentX - mouseStartX; track.style.transform = 'translateX(-' + Math.max(0, Math.min(getTargetOffset(currentReview) - diff, getMaxOffset())) + 'px)'; });
        document.addEventListener('mouseup', function(e) { if (!isDragging) return; isDragging = false; track.style.cursor = 'grab'; var diff = mouseStartX - mouseCurrentX; if (Math.abs(diff) > 40) { diff > 0 ? nextReview() : (currentReview > 0 ? (currentReview--, updateReviews(true), resetReviewInterval()) : null); } else { updateReviews(true); } resumeReviews(); });
    }

    var resizeTimeout;
    window.addEventListener('resize', function() { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(function() { updateReviews(false); }, 200); });
});
