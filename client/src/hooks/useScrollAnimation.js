import { useEffect } from 'react';

const useScrollAnimation = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');

                        // Handle stagger animations
                        if (entry.target.classList.contains('stagger-animate')) {
                            const children = entry.target.children;
                            Array.from(children).forEach((child, index) => {
                                setTimeout(() => {
                                    child.style.opacity = '1';
                                    child.style.animation = `fadeInUp 0.6s ease forwards`;
                                }, index * 100);
                            });
                        }
                    } else {
                        // Remove animate class and reset opacity for re-triggering if needed
                        entry.target.classList.remove('animate');
                        if (entry.target.classList.contains('stagger-animate')) {
                            const children = entry.target.children;
                            Array.from(children).forEach((child) => {
                                child.style.opacity = '';
                                child.style.animation = '';
                            });
                        }
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Observe all elements with animate-on-scroll class
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((element) => {
            observer.observe(element);
        });

        return () => {
            elements.forEach((element) => {
                observer.unobserve(element);
            });
        };
    }, []);
};

export default useScrollAnimation;