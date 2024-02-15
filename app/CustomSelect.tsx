"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomSelect({
    value,
    setValue,
    allOptions,
    ...rest
}: {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    allOptions: ISchedule["cause"][];
} & Partial<
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >
>) {
    const inputRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const [selectedValue, setSelectedValue] = useState(0);

    function focus(
        index: number,
        lists: NodeListOf<Element>,
        options: HTMLDivElement
    ) {
        if (lists.length === 0) return;
        if (index > -1 && index < lists.length) {
            let top = 0;
            lists.forEach((list: Element, i: number) => {
                if (i < index) {
                    top += list.getBoundingClientRect().height;
                }
                list.classList.remove("focused");
            });
            lists[index].classList.add("focused");
            options.scrollTo(0, top);
        }
    }

    useEffect(() => {
        const options = optionsRef.current!;
        let blocks = options.querySelectorAll(".option.block");
        focus(selectedValue, blocks, optionsRef.current!);
    }, [selectedValue]);

    return (
        <div className="select-container">
            <input
                value={value}
                onChange={e => {
                    setSelectedValue(0);
                    const options = optionsRef.current!;
                    if (e.target.value === "") {
                        options.style.display = "none";
                    } else {
                        options.style.display = "block";
                    }

                    let lists = options.querySelectorAll(".option");

                    for (let i = 0; i < lists.length; i++) {
                        const element = lists[i];
                        if (
                            element
                                .textContent!.toUpperCase()
                                .indexOf(e.target.value.toUpperCase()) > -1
                        ) {
                            element.classList.add("block");
                            element.classList.remove("none");
                        } else {
                            element.classList.add("none");
                            element.classList.remove("block");
                        }
                    }
                    let blocks = options.querySelectorAll(".option.block");
                    blocks.forEach(block => {
                        block.addEventListener("click", e => {
                            setValue((e.target as HTMLDivElement).textContent!);
                        });
                    });
                    focus(0, blocks, options);
                    setValue(e.target.value);
                }}
                onBlur={() => {
                    setTimeout(() => {
                        optionsRef.current!.style.display = "none";
                    }, 500);
                }}
                onKeyDown={e => {
                    const options = optionsRef.current!;
                    let blocks = options.querySelectorAll(".option.block");
                    if (e.key === "ArrowDown") {
                        e.preventDefault();
                        if (blocks.length - 1 > selectedValue) {
                            setSelectedValue(prev => prev + 1);
                        } else {
                            setSelectedValue(0);
                        }
                    } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        if (selectedValue > 0) {
                            setSelectedValue(prev => prev - 1);
                        } else {
                            setSelectedValue(blocks.length - 1);
                        }
                    } else if (e.key === "Enter") {
                        e.preventDefault();
                        setValue(blocks?.[selectedValue].textContent!);
                        options.style.display = "none";
                        inputRef.current!.focus();
                        blocks.forEach(b => {
                            b.classList.remove("block");
                        });
                    }
                }}
                type="text"
                className="bg-inherit w-full"
                ref={inputRef}
                {...rest}
            />
            <div className="options" ref={optionsRef}>
                {allOptions.map((el, i) => (
                    <div key={i} className="option">
                        {el}
                    </div>
                ))}
            </div>
        </div>
    );
}
