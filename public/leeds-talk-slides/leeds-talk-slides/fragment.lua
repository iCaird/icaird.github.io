io.stderr:write("filter running\n")

function Table(el)
  io.stderr:write("found table\n")
  for _, body in ipairs(el.bodies) do
    for _, row in ipairs(body.body) do
      io.stderr:write("row type: " .. tostring(row.t) .. "\n")
      for k, v in pairs(row) do
        io.stderr:write("  key: " .. tostring(k) .. "\n")
      end
      local is_fragment = false
      for j, cell in ipairs(row.cells) do
        if j == 1 then
          for i, block in ipairs(cell.contents) do
            if block.t == "Plain" and #block.content == 1 then
              local inline = block.content[1]
              if inline.t == "Str" and inline.text == "^" then
                is_fragment = true
                table.remove(cell.contents, i)
                break
              end
            end
          end
        end
      end
      if is_fragment then
        row.attr.classes:insert(" fragment highlight-green my-bold custom")
        table.remove(row.cells, 1)
      end
    end
  end
  return el
end
